import { MemberModel } from '@/app/models/member.model';
import { serverAAxios } from '../../utils/axiosInstance';

const BASE_URL = '/members';

export const memberService = {
  
  // ----- queries -----

  // memberId 로 member 요청
  getMemberById: (memberId: number) => 
    serverAAxios.get<MemberModel>(`${BASE_URL}/${memberId}`)
      .then(response => response.data),

  // email 로 member 요청
  getMemberByEmail: (email: string) => 
    serverAAxios.get<MemberModel>(`${BASE_URL}/email/${email}`)
      .then(response => response.data),

  // jwt 토큰으로 member 요청
  getCurrentMember: () => 
    serverAAxios.get<MemberModel>(`${BASE_URL}/me`)
      .then(response => response.data),

  // ----- mutations -----

  // member 추가 요청
  createMember: (email: string) => 
    serverAAxios.post<MemberModel>(BASE_URL, email)
      .then(response => response.data),

  // member 삭제 요청
  deleteMember: (memberId: number) => 
    serverAAxios.delete(`${BASE_URL}/${memberId}`),

};