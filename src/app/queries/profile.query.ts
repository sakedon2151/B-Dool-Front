// hooks/useProfileQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileModel } from '../models/profile.model';
import { profileService } from '../services/member/profile.service';

export const profileKeys = {
  all: ['profiles'] as const,
  lists: () => [...profileKeys.all, 'list'] as const,
  list: (workspaceId: number) => [...profileKeys.lists(), workspaceId] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (id: number) => [...profileKeys.details(), id] as const,
};

export const useProfileQueries = (workspaceId: number) => {
  const queryClient = useQueryClient();

  const getProfilesByWorkspace = useQuery({
    queryKey: profileKeys.list(workspaceId),
    queryFn: () => profileService.getProfilesByWorkspaceId(workspaceId),
    enabled: !!workspaceId,
  });

  const getProfileById = (profileId: number) => useQuery({
    queryKey: profileKeys.detail(profileId),
    queryFn: () => profileService.getProfileById(profileId),
    enabled: !!profileId,
  });

  const updateProfile = useMutation({
    mutationFn: ({ profileId, data }: { profileId: number; data: ProfileModel }) => 
      profileService.updateProfile(profileId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(data.id) });
    },
  });

  const deleteProfile = useMutation({
    mutationFn: (profileId: number) => profileService.deleteProfile(profileId),
    onSuccess: (_, profileId) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(profileId) });
    },
  });

  const createProfile = useMutation({
    mutationFn: ({ memberId, data }: { memberId: number; data: ProfileModel }) => 
      profileService.createProfile(memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
    },
  });

  const createInvitedProfile = useMutation({
    mutationFn: ({ memberId, workspaceId, data }: { memberId: number; workspaceId: number; data: ProfileModel }) => 
      profileService.createInvitedProfile(memberId, workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.lists() });
    },
  });

  const updateProfileStatus = useMutation({
    mutationFn: ({ profileId, status }: { profileId: number; status: string }) => 
      profileService.updateProfileStatus(profileId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(data.id) });
    },
  });

  const updateProfileOnlineStatus = useMutation({
    mutationFn: ({ profileId, isOnline }: { profileId: number; isOnline: boolean }) => 
      profileService.updateProfileOnlineStatus(profileId, isOnline),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail(data.id) });
    },
  });

  const checkProfileExists = useMutation({
    mutationFn: (profileId: number) => profileService.checkProfileExists(profileId),
  });

  return {
    getProfilesByWorkspace,
    getProfileById,
    updateProfile,
    deleteProfile,
    createProfile,
    createInvitedProfile,
    updateProfileStatus,
    updateProfileOnlineStatus,
    checkProfileExists,
  };
};