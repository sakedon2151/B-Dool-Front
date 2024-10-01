import { serverAAxios } from "../axiosInstance";

export const mailService = {

  // POST - /api/mail/send-verification-code
  sendVerificationCode: async (email: string): Promise<boolean> => {
    const response = await serverAAxios.post<boolean>("/mail/send-verification-code", email);
    return response.data;
  },
  
  // POST - /api/mail/verify-code
  verifyCode: async (email: string, verificationCode: number): Promise<boolean> => {
    const response = await serverAAxios.post<boolean>("/mail/verify-code", {email, verificationCode});
    return response.data;
  },

};
