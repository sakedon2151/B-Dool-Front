import { MemberModel } from '@/app/models/member.model';
import { serverAAxios } from '../../utils/axiosInstance';

const BASE_URL = '/members';

export const memberService = {
  getMemberById: (memberId: number) => 
    serverAAxios.get<MemberModel>(`${BASE_URL}/${memberId}`)
      .then(response => response.data),

  createMember: (email: string) => 
    serverAAxios.post<MemberModel>(BASE_URL, email)
      .then(response => response.data),

  deleteMember: (memberId: number) => 
    serverAAxios.delete(`${BASE_URL}/${memberId}`),

  checkMemberExists: (memberId: number) => 
    serverAAxios.get<boolean>(`${BASE_URL}/exists/${memberId}`)
      .then(response => response.data),

  getCurrentMember: () => 
    serverAAxios.get<MemberModel>(`${BASE_URL}/me`)
      .then(response => response.data),

  getAllMembers: () => 
    serverAAxios.get<MemberModel[]>(BASE_URL)
      .then(response => response.data),

  getMemberCount: () => 
    serverAAxios.get<number>(`${BASE_URL}/count`)
      .then(response => response.data)
};