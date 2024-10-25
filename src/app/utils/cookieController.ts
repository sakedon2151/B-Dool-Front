import { destroyCookie, parseCookies, setCookie } from "nookies";
import { WorkspaceModel } from "../models/workspace.model";

interface WorkspaceMetadata {
  title: string;
  description: string;
}

// JWT 토큰 관련 함수들
export const setToken = (token: string) => {
  setCookie(null, "accessToken", token, {
    maxAge: 30 * 24 * 60 * 60, // 유효기간: 30일
    sameSite: 'strict',
    path: "/",
  });
};

export const getToken = (ctx = null) => {
  const cookies = parseCookies(ctx);
  return cookies.accessToken || null;
};

export const removeToken = (ctx = null) => {
  destroyCookie(ctx, "accessToken", {
    path: '/',
  });
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