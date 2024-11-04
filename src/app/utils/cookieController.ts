import { destroyCookie, parseCookies, setCookie } from "nookies";
import { WorkspaceModel } from "../models/workspace.model";
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  exp: number;
}

interface WorkspaceMetadata {
  title: string;
  description: string;
}

// 30분 유효기간의 쿠키로 토큰 저장
export const setToken = (token: string) => {
  if (!token) {
    throw new Error('유효한 토큰이 없습니다.');
  }
  setCookie(null, "accessToken", token, {
    maxAge: 15 * 60, // 15분
    // sameSite: 'strict',
    sameSite: 'lax',
    path: "/",
    secure: process.env.NODE_ENV === 'production',
    // httpOnly: true,
  });
};

// 토큰 존재 및 유효성 검증 후 반환
export const getToken = (ctx = null) => {
  const cookies = parseCookies(ctx);
  const token = cookies.accessToken;
  // 토큰 존재 여부와 유효성 체크
  if (token) {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      if (decoded.exp * 1000 > Date.now()) {
        return token;
      }
    } catch (error) {
      console.error('Token decode error:', error);
    }
  }
  return null;
};

// 토큰 제거
export const removeToken = (ctx = null) => {
  destroyCookie(ctx, "accessToken", {
    path: '/',
  });
};

// 만료 5분 전 체크
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const expiresIn = decoded.exp * 1000 - Date.now();
    return expiresIn < 5 * 60 * 1000; // 5분 미만 남은 경우
  } catch {
    return false;
  }
};

// 완전 만료 여부 체크
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const expiresIn = decoded.exp * 1000 - Date.now();
    return expiresIn < 2 * 60 * 1000; // 2분 전에 체크하도록 수정
  } catch {
    return true;
  }
};

// METADATA 관련 함수들
export const setWorkspaceMetadata = (workspace: WorkspaceModel) => {
  const metadata: WorkspaceMetadata = {
    title: workspace.name,
    description: workspace.description || '가볍게 사용하는 협업 메신저'
  };
  setCookie(null, "workspaceMetadata", JSON.stringify(metadata), {
    path: "/",
    sameSite: 'strict',
  });
};

export const getWorkspaceMetadata = (ctx = null): WorkspaceMetadata | null => {
  const cookies = parseCookies(ctx);
  try {
    return cookies.workspaceMetadata ? 
      JSON.parse(cookies.workspaceMetadata) : 
      null;
  } catch (error) {
    console.error('워크스페이스 메타데이터 파싱 오류:', error);
    return null;
  }
};

export const removeWorkspaceMetadata = (ctx = null) => {
  destroyCookie(ctx, "workspaceMetadata", {
    path: '/',
  });
};