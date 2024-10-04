import { destroyCookie, parseCookies, setCookie } from "nookies";
import jwt from 'jsonwebtoken'

// 쿠키에 토큰 셋팅 - 백엔드에서 쿠키까지 생성하기로 함
// export const setToken = (token: string) => {
//   setCookie(null, "auth_token", token, {
//     maxAge: 30 * 24 * 60 * 60, // 토큰 유효기간: 30일
//     path: "/",
//     httpOnly: true, // 자바스크립트 접근 제한
//     sameSite: 'strict' // CSRF 공격 방지
//   });
// };

// 저장된 토큰 호출
export const getToken = (ctx = null) => {
  const cookies = parseCookies(ctx);
  return cookies.accessToken || null;
};

// 로그아웃시 강제 토큰 제거
export const removeToken = (ctx = null) => {
  destroyCookie(ctx, "accessToken", {
    path: '/', // 쿠키의 path를 지정
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