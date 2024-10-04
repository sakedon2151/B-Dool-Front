import { MemberModel } from '@/app/models/member.model';
import { serverAAxios } from '../axiosInstance';

export const memberService = {
  
  // GET - /api/members/{memberId}
  getMemberById: async (memberId: number): Promise<MemberModel> => {
    const response = await serverAAxios.get<MemberModel>(`/members/${memberId}`);
    return response.data;
  },

  // POST - /api/members
  createMember: async (email: string): Promise<MemberModel> => {
    const response = await serverAAxios.post<MemberModel>('/members', email);
    return response.data;
  },

  // DELETE - /api/members/{memberId}
  deleteMember: async (memberId: number): Promise<void> => {
    await serverAAxios.delete(`/members/${memberId}`);
  },

  // GET - /api/members/exists/{memberId}
  checkMemberExists: async (memberId: number): Promise<boolean> => {
    const response = await serverAAxios.get<boolean>(`/members/exists/${memberId}`);
    return response.data;
  },

  // GET - /api/members/me
  getCurrentMember: async (): Promise<MemberModel> => {
    const response = await serverAAxios.get<MemberModel>('/members/me');
    return response.data;
  },

  // GET - /api/members/ - Not Used
  getAllMembers: async (): Promise<MemberModel[]> => {
    const response = await serverAAxios.get<MemberModel[]>('/members');
    return response.data;
  },

  // GET - /api/members/count - Not Used
  getMemberCount: async (): Promise<number> => {
    const response = await serverAAxios.get<number>('/members/count');
    return response.data;
  },

};

