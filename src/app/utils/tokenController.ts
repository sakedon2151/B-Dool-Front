import { destroyCookie, parseCookies, setCookie } from "nookies";
import jwt from 'jsonwebtoken'

// 쿠키에 토큰 저장 - 백엔드에서 쿠키까지 생성하기로 함
// export const setToken = (token: string) => {
//   setCookie(null, "auth_token", token, {
//     maxAge: 30 * 24 * 60 * 60, // 토큰 유효기간: 30일
//     path: "/",
//     httpOnly: true, // 자바스크립트 접근 제한
//     sameSite: 'strict' // CSRF 공격 방지
//   });
// };

// 저장된 토큰 호출
export const getToken = () => {
  const cookies = parseCookies();
  return cookies.auth_token;
};

// 로그아웃시 강제 토큰 제거
export const removeToken = () => {
  destroyCookie(null, "auth_token");
};

// 토큰 검증 - 추후 고려사항
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) // 비밀키로 토큰검증
  } catch {
    return null
  }
}