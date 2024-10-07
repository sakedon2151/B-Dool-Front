export interface MemberModel {
  id: number;
  email: string;
  createdAt: string;
}

export const InitialMember: MemberModel = {
  id: 0,
  email: '',
  createdAt: ''
}

// Strict Type Model