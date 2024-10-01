import { MemberModel } from '@/app/models/member.model';
import { StateCreator } from 'zustand';

export interface MemberState {
  currentMember: MemberModel | null;
}

export interface MemberActions {
  setCurrentMember: (member: MemberState['currentMember']) => void;
}

export type MemberSlice = MemberState & MemberActions;

export const createMemberSlice: StateCreator<MemberSlice> = (set) => ({
  currentMember: null,
  setCurrentMember: (member) => set({ currentMember: member }),
});