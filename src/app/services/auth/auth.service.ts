import { serverTokenAxios } from "../../utils/axiosInstance";

const BASE_URL = '/auth';

export const authService = {
  generateToken: (email: string) => 
    serverTokenAxios.post<string>(`${BASE_URL}/token`, null, { params: { email } })
      .then(response => response.data),

  refreshToken: () => 
    serverTokenAxios.post<string>(`${BASE_URL}/refresh`)
      .then(response => response.data)
};