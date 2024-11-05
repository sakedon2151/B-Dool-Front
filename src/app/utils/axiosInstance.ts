import axios, { AxiosInstance } from 'axios';
import { getToken, isTokenExpiringSoon, removeToken, setToken } from './cookieController';
import { authService } from '../services/auth/auth.service';

// 상수 정의
const AUTH_ERROR_CODES = [401, 403];
// const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5분
const PUBLIC_ENDPOINTS = [
  '/mail/send-verification-code',
  '/mail/verify-code',
  '/auth/token',
  '/auth/refresh'
];

interface QueueItem {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

const isPublicEndpoint = (url: string): boolean => 
  PUBLIC_ENDPOINTS.some(endpoint => url.endsWith(endpoint));
const redirectToAuth = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/auth';
  }
};

// debug logging
const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Auth Debug] ${message}`, data);
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

const createAxiosInstance = (baseURL: string): AxiosInstance => {
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
      if (isPublicEndpoint(config.url || '')) {
        return config;
      }
      try {
        let token = getToken();
        if (!token) {
          debugLog('No token found, attempting refresh');
          try {
            const newToken = await authService.refreshToken();
            setToken(newToken);
            token = newToken;
          } catch (error) {
            debugLog('Token refresh failed during request', error);
            redirectToAuth();
            throw new Error('인증이 필요합니다.');
          }
        }
        if (isTokenExpiringSoon(token)) {
          if (!isRefreshing) {
            isRefreshing = true;
            debugLog('Token expiring soon, refreshing');
            try {
              const newToken = await authService.refreshToken();
              setToken(newToken);
              token = newToken;
              isRefreshing = false;
              processQueue();
            } catch (error) {
              debugLog('Token refresh failed', error);
              isRefreshing = false;
              processQueue(error);
              removeToken();
              redirectToAuth();
              throw error;
            }
          } else {
            debugLog('Waiting for token refresh');
            await new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });
            token = getToken();
          }
        }
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      } catch (error) {
        debugLog('Request interceptor error', error);
        throw error;
      }
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
      if (!error.config) {
        debugLog('No config in error object', error);
        return Promise.reject(error);
      }
      const originalRequest = error.config;
      if (isPublicEndpoint(originalRequest.url)) {
        return Promise.reject(error);
      }
      // 인증 에러 처리
      if (AUTH_ERROR_CODES.includes(error.response?.status) && !originalRequest._retry) {
        if (!isRefreshing) {
          isRefreshing = true;
          originalRequest._retry = true;
          debugLog('Auth error, attempting token refresh');
          try {
            const newToken = await authService.refreshToken();
            setToken(newToken);
            isRefreshing = false;
            processQueue();
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return instance(originalRequest);
          } catch (refreshError) {
            debugLog('Token refresh failed in response interceptor', refreshError);
            isRefreshing = false;
            processQueue(refreshError);
            removeToken();
            redirectToAuth();
            return Promise.reject(refreshError);
          }
        } else {
          debugLog('Waiting for token refresh in response interceptor');
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            const newToken = getToken();
            if (newToken) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return instance(originalRequest);
            }
            return Promise.reject(new Error('토큰 갱신 실패'));
          });
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