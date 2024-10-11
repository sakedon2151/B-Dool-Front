export interface MemberModel {
  id: number;
  email: string;
  createdAt: string;
}

export interface MemberInsertModel {
  email: string;
}

export interface MemberUpdateModel {
  id: number
  email: string
}

export const InitialMember: MemberModel = {
  id: 0,
  email: '',
  createdAt: ''
}