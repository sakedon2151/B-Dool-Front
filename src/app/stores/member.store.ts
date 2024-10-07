import { create } from "zustand";
import { InitialMember, MemberModel } from "../models/member.model";

interface MemberState {
  currentMember: MemberModel;
  setCurrentMember: (member: MemberModel) => void;
}

export const useMemberStore = create<MemberState>((set) => ({
  currentMember: InitialMember,
  setCurrentMember: (member) => set({ currentMember: member }),
}));
