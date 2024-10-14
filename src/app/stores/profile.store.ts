import { InitialProfile, ProfileModel } from '../models/profile.model';
import { createPersistStore } from './session.middleware';

export interface ProfileState {
  currentProfile: ProfileModel;
  setCurrentProfile: (profile: ProfileModel) => void;
  fetchedProfiles: ProfileModel[];
  setFetchedProfiles: (profiles: ProfileModel[]) => void;
}

export const useProfileStore = createPersistStore<ProfileState>(
  (set) => ({
    currentProfile: InitialProfile,
    setCurrentProfile: (profile) => set({ currentProfile: profile }),
    fetchedProfiles: [],
    setFetchedProfiles: (profiles) => set({ fetchedProfiles: profiles }),
  }),
  'profile-storage'
);