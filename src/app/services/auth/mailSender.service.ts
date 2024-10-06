import { serverAAxios } from "../../utils/axiosInstance";

const BASE_URL = '/mail';

export const mailService = {
  sendVerificationCode: (email: string) => 
    serverAAxios.post<boolean>(`${BASE_URL}/send-verification-code`, null, { params: { email } })
      .then(response => response.data),
  
  verifyCode: (email: string, verificationCode: number) => 
    serverAAxios.post<boolean>(`${BASE_URL}/verify-code`, null, { params: {email, verificationCode}})
      .then(response => response.data)
};