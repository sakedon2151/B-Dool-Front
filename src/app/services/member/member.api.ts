import { serverAAxios } from '../axiosInstance';

export const authService = {
  login: async (loginData: LoginRequest): Promise<LoginResponse> => {
    const response = await serverAAxios.post<LoginResponse>('/auth/login', loginData);
    return response.data;
  },

  verifyCode: async (verifyData: VerificationRequest): Promise<LoginResponse> => {
    const response = await serverAAxios.post<LoginResponse>('/auth/verify', verifyData);
    return response.data;
  }
};

