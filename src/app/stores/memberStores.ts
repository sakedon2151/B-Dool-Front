import { create } from "zustand";
import { InitialMember, MemberModel } from "../models/member.model";

interface FetchedMemberStore {
  fetchedMember: MemberModel;
  setFetchedMember: (member: MemberModel) => void;
  clearFetchedMember: () => void;
}

const InitialFetchedMemberStore = InitialMember

export const useMemberStore = create<FetchedMemberStore>((set) => ({
  fetchedMember: InitialFetchedMemberStore,
  setFetchedMember: (member) => set({ fetchedMember: member }),
  clearFetchedMember: () => set({ fetchedMember: InitialFetchedMemberStore })
}));
