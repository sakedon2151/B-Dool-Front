import { serverTokenAxios } from "../axiosInstance";

export const authService = {
  
  // POST - /api/auth/token
  generateToken: async (email: string): Promise<void> => {
    const response = await serverTokenAxios.get<void>('/auth/token');
    return response.data
  },

  //POST - /api/auth/refresh
  refreshToken: async (): Promise<void> => {
    const response = await serverTokenAxios.get<void>('/auth/refresh');
    return response.data
  }

};