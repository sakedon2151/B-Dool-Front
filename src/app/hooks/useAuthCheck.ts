import { useEffect, useState } from "react";
import { getToken, isTokenExpired, isTokenExpiringSoon } from "../utils/cookieController";
import { authService } from "../services/auth/auth.service";

interface AuthCheckResult {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
}

export function useAuthCheck(): AuthCheckResult {
  const [authState, setAuthState] = useState<AuthCheckResult>({
    isAuthChecked: false,
    isAuthenticated: false
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let token = getToken();

        // 토큰이 없는 경우 즉시 로그인 페이지로
        if (!token) {
          window.location.href = '/auth';
          return;
        }
        // 만료 임박한 경우에만 리프레시 시도
        if (isTokenExpiringSoon(token)) {
          try {
            token = await authService.refreshToken();
            setAuthState({
              isAuthChecked: true,
              isAuthenticated: true
            });
          } catch (error) {
            // 리프레시 실패해도 기존 토큰이 완전히 만료되지 않았다면 계속 사용
            if (!isTokenExpired(token)) {
              setAuthState({
                isAuthChecked: true,
                isAuthenticated: true
              });
            } else {
              throw error;
            }
          }
        } else {
          setAuthState({
            isAuthChecked: true,
            isAuthenticated: true
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          isAuthChecked: true,
          isAuthenticated: false
        });
      }
    };
    checkAuth();
  }, []);
  return authState;
}