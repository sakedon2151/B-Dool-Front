import { serverAAxios } from "../axiosInstance";

export const mailService = {

  // 인증코드 요청 - 쿠키가 없는 사람은 해당 post 요청을 하는 form 을 받게 됨
  // POST - /api/mail/send-verification-code
  sendVerificationCode: async (email: string): Promise<boolean> => {
    const response = await serverAAxios.post<boolean>("/mail/send-verification-code", null, { params: { email } });
    return response.data;
  },
  
  // 상단 이메일 입력 form submit 이후 return 값 true 시 사용
  // POST - /api/mail/verify-code
  verifyCode: async (email: string, verificationCode: number): Promise<boolean> => {
    const response = await serverAAxios.post<boolean>("/mail/verify-code", null, { params: {email, verificationCode}});
    return response.data;
  },

};
