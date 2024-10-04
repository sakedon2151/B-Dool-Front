import { serverTokenAxios } from "../axiosInstance";

export const authService = {
  
  // 토큰 발급 -> 이메일도 토큰도 없는 신규회원 + 리프레쉬 토큰이 만료된 기존회원 이! 6자리 인증번호에서 true 를 받으면! 자동으로 api 접근
  // POST - /api/auth/token
  generateToken: async (email: string): Promise<boolean> => {
    const response = await serverTokenAxios.post<boolean>('/auth/token', null, { params: { email } });
    return response.data;
  },

  // 토큰 리프레쉬 -> 엑세스 토큰 갱신 및 리프레쉬 토큰 검증 = 리프레쉬 만료 됬으면 이메일 입력하고 6자리 받게 만들기
  //POST - /api/auth/refresh
  refreshToken: async (): Promise<void> => {
    const response = await serverTokenAxios.post<void>('/auth/refresh');
    return response.data;
  }

};