import { destroyCookie, parseCookies, setCookie } from "nookies";
import jwt from 'jsonwebtoken'

// 쿠키에 토큰 저장
export const setToken = (token: string) => {
  setCookie(null, "auth_token", token, {
    maxAge: 30 * 24 * 60 * 60, // 토큰 유효기간: 30일
    path: "/",
    httpOnly: true, // 자바스크립트 접근 제한
    sameSite: 'strict' // CSRF 공격 방지

  });
};

// 저장된 토큰 호출
export const getToken = () => {
  const cookies = parseCookies();
  return cookies.auth_token;
};

// 로그아웃시 강제 토큰 제거
export const removeToken = () => {
  destroyCookie(null, "auth_token");
};

// 토큰 검증
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) // 비밀키로 토큰검증
  } catch {
    return null
  }
}

// 백엔드에서 쿠키를 설정해서 전달해준다면 setCookie 함수는 불필요해짐.
// 백엔드가 쿠키에 토큰을 담아서 전달해줌