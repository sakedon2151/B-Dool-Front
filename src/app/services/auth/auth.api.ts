import { serverTokenAxios } from "../axiosInstance";

export const authService = {
  
  // 토큰 발급
  // POST - /api/auth/token
  generateToken: async (email: string): Promise<boolean> => {
    const response = await serverTokenAxios.post<boolean>('/auth/token', email);
    return response.data;
  },

  // 토큰 리프레쉬
  //POST - /api/auth/refresh
  refreshToken: async (): Promise<void> => {
    const response = await serverTokenAxios.post<void>('/auth/refresh');
    return response.data;
  }

};