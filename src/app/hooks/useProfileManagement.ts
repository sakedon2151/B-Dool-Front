import { useProfileQueries } from '../queries/profile.query';
import { useProfileStore } from '../stores/profile.store';
import { useWorkspaceStore } from '../store/workspaceStore'; // 워크스페이스 store import 가정

export const useProfileManagement = () => {
  const { currentWorkspaceId } = useWorkspaceStore();
  const { currentProfile, setCurrentProfile, fetchedProfiles, setFetchedProfiles } = useProfileStore();
  const { 
    getProfilesByWorkspace,
    getProfileById,
    updateProfile,
    deleteProfile,
    createProfile,
    createInvitedProfile,
    updateProfileStatus,
    updateProfileOnlineStatus,
    checkProfileExists
  } = useProfileQueries(currentWorkspaceId);

  // getProfilesByWorkspace 쿼리의 결과를 store에 저장
  if (getProfilesByWorkspace.data) {
    setFetchedProfiles(getProfilesByWorkspace.data);
  }

  return {
    profiles: fetchedProfiles,
    isLoading: getProfilesByWorkspace.isLoading,
    error: getProfilesByWorkspace.error,
    currentProfile,
    setCurrentProfile,
    getProfileById: getProfileById,
    updateProfile: updateProfile.mutate,
    deleteProfile: deleteProfile.mutate,
    createProfile: createProfile.mutate,
    createInvitedProfile: createInvitedProfile.mutate,
    updateProfileStatus: updateProfileStatus.mutate,
    updateProfileOnlineStatus: updateProfileOnlineStatus.mutate,
    checkProfileExists: checkProfileExists.mutateAsync,
    isUpdatingProfile: updateProfile.isPending,
    isDeletingProfile: deleteProfile.isPending,
    isCreatingProfile: createProfile.isPending,
    isCreatingInvitedProfile: createInvitedProfile.isPending,
    isUpdatingProfileStatus: updateProfileStatus.isPending,
    isUpdatingProfileOnlineStatus: updateProfileOnlineStatus.isPending,
    isCheckingProfileExists: checkProfileExists.isPending,
  };
};