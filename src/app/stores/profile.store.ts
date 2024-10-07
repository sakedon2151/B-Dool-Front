import { create } from 'zustand';
import { InitialProfile, ProfileModel } from '../models/profile.model';

interface ProfileState {
  currentProfile: ProfileModel;
  setCurrentProfile: (profile: ProfileModel) => void;
  fetchedProfiles: ProfileModel[];
  setFetchedProfiles: (profiles: ProfileModel[]) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  currentProfile: InitialProfile,
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  fetchedProfiles: [],
  setFetchedProfiles: (profiles) => set({ fetchedProfiles: profiles }),
}));