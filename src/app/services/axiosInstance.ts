import axios, { AxiosInstance } from 'axios';

// 기본 axios 인스턴스 생성 함수
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API call error:', error);
      return Promise.reject(error);
    }
  );

  return instance;
};

// 각 MSA 서버에 대한 axios 인스턴스 생성
export const serverAAxios = createAxiosInstance(process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://211.188.50.55:8080/api');
export const serverBAxios = createAxiosInstance(process.env.NEXT_PUBLIC_USER_API_URL || 'http://211.188.50.29:8080/api');
export const serverCAxios = createAxiosInstance(process.env.NEXT_PUBLIC_PRODUCT_API_URL || 'http://localhost:3003/api');