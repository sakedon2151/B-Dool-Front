import { create } from 'zustand';
import { ProfileModel } from '@/app/models/profile.model';

interface ProfileStore {
  currentProfile: ProfileModel | null;
  profiles: ProfileModel[];
  setCurrentProfile: (profile: ProfileModel) => void;
  setProfiles: (profiles: ProfileModel[]) => void;

  updateProfile: (updatedProfile: ProfileModel) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  currentProfile: null,
  profiles: [],
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  setProfiles: (profiles) => set({ profiles }),
  
  updateProfile: (updatedProfile) => set((state) => ({
    profiles: state.profiles.map(profile => 
      profile.id === updatedProfile.id ? updatedProfile : profile
    ),
    currentProfile: state.currentProfile?.id === updatedProfile.id 
      ? updatedProfile 
      : state.currentProfile
  })),
}));