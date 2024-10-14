import { InitialMember, MemberModel } from "../models/member.model";
import { createPersistStore } from "./session.middleware";

interface MemberState {
  currentMember: MemberModel;
  setCurrentMember: (member: MemberModel) => void;
}

export const useMemberStore = createPersistStore<MemberState>(
  (set) => ({
    currentMember: InitialMember,
    setCurrentMember: (member) => set({ currentMember: member }),
  }),
  'member-storage'
);