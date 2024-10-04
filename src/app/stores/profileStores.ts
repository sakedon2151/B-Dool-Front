import { create } from "zustand";
import { InitialProfile, ProfileModel } from "../models/profile.model";

interface FetchedProfileStore {
  fetchedProfile: ProfileModel;
  setFetchedProfile: (profile: ProfileModel) => void;
  clearFetchedProfile: () => void;
}

const InitialFetchedProfileStore = InitialProfile

export const useProfileStore = create<FetchedProfileStore>((set) => ({
  fetchedProfile: InitialFetchedProfileStore,
  setFetchedProfile: (profile) => set({ fetchedProfile: profile }),
  clearFetchedProfile: () => set({ fetchedProfile: InitialFetchedProfileStore })
}))
