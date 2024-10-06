import { create } from 'zustand';
import { ProfileModel } from '../models/profile.model';

interface ProfileState {
  currentProfile: ProfileModel | null;
  setCurrentProfile: (profile: ProfileModel) => void;

  fetchedProfiles: ProfileModel[];
  setFetchedProfiles: (profiles: ProfileModel[]) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  currentProfile: null,
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  
  fetchedProfiles: [],
  setFetchedProfiles: (profiles) => set({ fetchedProfiles: profiles }),
}));