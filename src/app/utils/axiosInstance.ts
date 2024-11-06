import axios, { AxiosInstance } from 'axios';
import { getToken, setToken } from './cookieController';
import { authService } from '../services/auth/auth.service';

const AUTH_ERROR_CODES = [401, 403];

const PUBLIC_ENDPOINTS = {
  AUTH: [
    '/auth',
    '/auth/token',
    '/auth/refresh'
  ],
  MAIL: [
    '/mail/send-verification-code',
    '/mail/verify-code',
    '/mail/verify-invitation',
    '/mail/send-invitation'
  ],
};

interface QueueItem {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

const isPublicEndpoint = (url: string): boolean => {
  return Object.values(PUBLIC_ENDPOINTS)
    .flat()
    .some(pattern => {
      if (pattern.includes('*')) {
        const regexPattern = pattern
          .replace(/\*/g, '.*')
          .replace(/\//g, '\\/');
        const regex = new RegExp(`^${regexPattern}`);
        return regex.test(url);
      }
      return url.endsWith(pattern);
    });
};

const redirectToAuth = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/auth';
  }
};

const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Auth Debug] ${message}`, data);
    if (data) {
      console.log('URL:', data?.config?.url);
      console.log('Is public:', isPublicEndpoint(data?.config?.url || ''));
    }
  }
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const refreshToken = async (): Promise<string | null> => {
  try {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }

    const token = getToken();
    if (!token) return null;

    isRefreshing = true;
    debugLog('Refreshing token');

    try {
      const newToken = await authService.refreshToken();
      setToken(newToken);
      processQueue();
      return newToken;
    } catch (error) {
      processQueue(error);
      throw error;
    } finally {
      isRefreshing = false;
    }

  } catch (error) {
    debugLog('Token refresh failed:', error);
    return null;
  }
};

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  // axios 인스턴스
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  // request 인터셉터
  instance.interceptors.request.use(
    async (config) => {
      // 토큰 불필요 공개 엔드포인트
      if (isPublicEndpoint(config.url || '')) {
        return config;
      }

      const token = getToken();
      if (!token) {
        // 토큰이 없는 경우에만 리다이렉트
        redirectToAuth();
        throw new Error('인증이 필요합니다.');
      }
      // 토큰이 있으면 헤더에 추가
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    },
    (error) => {
      debugLog('Request error', error);
      return Promise.reject(error);
    }
  );

  // response 인터셉터
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (!error.config || isPublicEndpoint(error.config.url)) {
        return Promise.reject(error);
      }
      
      if (AUTH_ERROR_CODES.includes(error.response?.status) && !error.config._retry) {
        error.config._retry = true;
        
        try {
          const newToken = await refreshToken();
          if (newToken) {
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
            return instance(error.config);
          }
        } catch (refreshError) {
          debugLog('Response refresh failed:', refreshError);
        }

        // 현재 경로가 /auth가 아닐 때만 리다이렉트
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
          redirectToAuth();
        }
      }

      return Promise.reject(error);
    }
  );
  return instance;
};

export const serverAAxios = createAxiosInstance(process.env.NEXT_PUBLIC_SERVER_A_API_URL as string);
export const serverBAxios = createAxiosInstance(process.env.NEXT_PUBLIC_SERVER_B_API_URL as string);
export const serverCAxios = createAxiosInstance(process.env.NEXT_PUBLIC_SERVER_C_API_URL as string);
export const serverChatBotAxios = createAxiosInstance(process.env.NEXT_PUBLIC_SERVER_A_CHATBOT_URL as string);
export const serverTokenAxios = createAxiosInstance(process.env.NEXT_PUBLIC_SERVER_A_TOKEN_URL as string);
export const serverElasticAxios = createAxiosInstance(process.env.NEXT_PUBLIC_SERVER_C_ELASTIC_URL as string);