import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileInsertModel, ProfileModel, ProfileUpdateModel } from "@/app/models/profile.model";
import { profileService } from '../services/member/profile.service';

// Query keys
const PROFILE_KEYS = {
  all: ['profiles'] as const,
  byId: (id: number) => [...PROFILE_KEYS.all, 'byId', id] as const,
  byMemberId: (memberId: number) => [...PROFILE_KEYS.all, 'byMemberId', memberId] as const,
  byWorkspaceId: (workspaceId: number) => [...PROFILE_KEYS.all, 'byWorkspaceId', workspaceId] as const,
};

// Queries
export const useProfileById = (profileId: number) => 
  useQuery({
    queryKey: PROFILE_KEYS.byId(profileId),
    queryFn: () => profileService.getProfileById(profileId),
  });

export const useProfilesByMemberId = (memberId: number) => 
  useQuery({
    queryKey: PROFILE_KEYS.byMemberId(memberId),
    queryFn: () => profileService.getProfilesByMemberId(memberId),
  });

export const useProfilesByWorkspaceId = (workspaceId: number) => 
  useQuery({
    queryKey: PROFILE_KEYS.byWorkspaceId(workspaceId),
    queryFn: () => profileService.getProfilesByWorkspaceId(workspaceId),
  });

// Mutations
export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: number; data: ProfileInsertModel }) => 
      profileService.createProfile(memberId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.byMemberId(variables.memberId) });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, data }: { profileId: number; data: ProfileUpdateModel }) => 
      profileService.updateProfile(profileId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.byId(data.id) });
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.deleteProfile,
    onSuccess: (_, profileId) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
      queryClient.removeQueries({ queryKey: PROFILE_KEYS.byId(profileId) });
    },
  });
};

export const useCreateProfileByInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, workspaceId, data }: { memberId: number; workspaceId: number; data: ProfileModel }) => 
      profileService.createProfileByInvitation(memberId, workspaceId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.byMemberId(variables.memberId) });
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.byWorkspaceId(variables.workspaceId) });
    },
  });
};

export const useUpdateProfileStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, status }: { profileId: number; status: string }) => 
      profileService.updateProfileStatus(profileId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.byId(data.id) });
    },
  });
};

export const useUpdateProfileOnlineStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, isOnline }: { profileId: number; isOnline: boolean }) => 
      profileService.updateProfileOnlineStatus(profileId, isOnline),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.byId(data.id) });
    },
  });
};