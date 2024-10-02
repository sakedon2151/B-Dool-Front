import axios, { AxiosInstance } from 'axios';
import { getToken } from '../utils/tokenController';

// 기본 axios 인스턴스 생성 함수
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000, // 10초
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // 쿠키를 포함한 크로스 도메인 요청을 허용
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config) => {
      const token = getToken(); // request에 access_token 같이 보내기
      if (token) {
        console.log("i have token")
        config.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.log("i dont have token")
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
      if (error.response && error.response.status === 401) {
        // 401 Unauthorized 에러 처리
        console.error('인증 에러: 다시 로그인이 필요합니다.');
        // 로그인 페이지로 리다이렉트
      }
      console.error('API call error:', error);
      return Promise.reject(error);
    }
  );

  return instance;
};

// 각 MSA 서버에 대한 axios 인스턴스 생성. env 설정은 나중에 알아보기
export const serverAAxios = createAxiosInstance(process.env.NEXT_PUBLIC_SERVER_A_API_URL as string);
export const serverBAxios = createAxiosInstance(process.env.NEXT_PUBLIC_SERVER_B_API_URL as string);
export const serverCAxios = createAxiosInstance(process.env.NEXT_PUBLIC_SERVER_C_API_URL as string);
export const serverTokenAxios = createAxiosInstance(process.env.NEXT_PUBLIC_SERVER_A_TOKEN_URL as string)