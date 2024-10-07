import { destroyCookie, parseCookies, setCookie } from "nookies";
import jwt from 'jsonwebtoken'

// 쿠키에 토큰 셋팅
export const setToken = (token: string) => {
  setCookie(null, "accessToken", token, {
    maxAge: 30 * 24 * 60 * 60, // 유효기간: 30일
    sameSite: 'strict',
    path: "/",
  });
};

// 저장된 토큰 호출
export const getToken = (ctx = null) => {
  const cookies = parseCookies(ctx);
  return cookies.accessToken || null;
};

// 로그아웃시 강제 토큰 제거
export const removeToken = (ctx = null) => {
  destroyCookie(ctx, "accessToken", {
    path: '/',
  });
};

// 토큰 검증 - 추후 고려사항
// export const verifyToken = (token: string) => {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET as string) // 비밀키로 토큰검증
//   } catch {
//     return null
//   }
// }