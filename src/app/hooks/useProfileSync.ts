import { useQueryClient } from '@tanstack/react-query';
import { useProfileStore } from '../stores/profile.store';
import useSSE from './useSSE';
import { PARTICIPANT_KEYS } from '../queries/participant.query';

interface ProfileUpdateEvent {
  profileId: number;
  nickname?: string;
  isOnline?: boolean;
  profileImgUrl?: string;
}

export function useProfileSync(channelId: string) {
  const queryClient = useQueryClient();
  const { currentProfile, setCurrentProfile } = useProfileStore();

  const handleProfileUpdate = (data: ProfileUpdateEvent) => {
    // 현재 프로필 업데이트 (스토어)
    if (data.profileId === currentProfile.id) {
      setCurrentProfile({
        ...currentProfile,
        ...data
      });
    }
    
    // participant 쿼리 무효화
    queryClient.invalidateQueries({
      queryKey: PARTICIPANT_KEYS.byChannelId(channelId)
    });
  };

  useSSE(process.env.NEXT_PUBLIC_SERVER_A_SSE_URL as string, {
    'nickname-change': handleProfileUpdate,
    'online-status-change': handleProfileUpdate,
    'profile-image-change': handleProfileUpdate
  });
}