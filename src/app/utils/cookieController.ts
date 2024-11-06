import { destroyCookie, parseCookies, setCookie } from "nookies";
import { WorkspaceModel } from "../models/workspace.model";
import { jwtDecode } from 'jwt-decode';

const TOKEN_NAME = 'accessToken';
const TOKEN_MAX_AGE = 24 * 60 * 60; // 24시간으로 설정

interface WorkspaceMetadata {
  title: string;
  description: string;
}

// 토큰 생성하기
export const setToken = (token: string) => {
  if (!token) {
    throw new Error('유효한 토큰이 없습니다.');
  }
  
  try {
    setCookie(null, TOKEN_NAME, token, {
      maxAge: TOKEN_MAX_AGE,
      path: "/",
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  } catch (error) {
    console.error('Token setting error:', error);
    throw error;
  }
};

// 토큰 가져오기
export const getToken = (ctx = null): string | null => {
  try {
    const cookies = parseCookies(ctx);
    return cookies[TOKEN_NAME] || null;
  } catch (error) {
    console.error('Token retrieval error:', error);
    return null;
  }
};

// 토큰 제거하기
export const removeToken = (ctx = null) => {
  try {
    destroyCookie(ctx, TOKEN_NAME, {
      path: '/',
    });
  } catch (error) {
    console.error('Token removal error:', error);
  }
};

// 워크스페이스 메타데이터 설정
export const setWorkspaceMetadata = (workspace: WorkspaceModel) => {
  try {
    const metadata: WorkspaceMetadata = {
      title: workspace.name,
      description: workspace.description || '가볍게 사용하는 협업 메신저'
    };
    setCookie(null, 'workspaceMetadata', JSON.stringify(metadata), {
      path: '/',
      sameSite: 'lax',
    });
  } catch (error) {
    console.error('Workspace metadata setting error:', error);
  }
};

// 워크스페이스 메타데이터 가져오기
export const getWorkspaceMetadata = (ctx = null): WorkspaceMetadata | null => {
  try {
    const cookies = parseCookies(ctx);
    const metadataStr = cookies.workspaceMetadata;
    if (!metadataStr) return null;
    
    const metadata = JSON.parse(metadataStr);
    if (!metadata.title) return null;
    
    return metadata;
  } catch (error) {
    console.error('Workspace metadata retrieval error:', error);
    return null;
  }
};

// 워크스페이스 메타데이터 제거
export const removeWorkspaceMetadata = (ctx = null) => {
  try {
    destroyCookie(ctx, 'workspaceMetadata', {
      path: '/',
    });
  } catch (error) {
    console.error('Workspace metadata removal error:', error);
  }
};