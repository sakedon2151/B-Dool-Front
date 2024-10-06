import { serverTokenAxios } from "../../utils/axiosInstance";

const BASE_URL = '/auth';

export const authService = {
  generateToken: (email: string) => 
    serverTokenAxios.post<boolean>(`${BASE_URL}/token`, null, { params: { email } })
      .then(response => response.data),

  refreshToken: () => 
    serverTokenAxios.post<void>(`${BASE_URL}/refresh`)
      .then(response => response.data)
};