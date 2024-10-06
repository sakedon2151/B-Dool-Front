import { useChannelQueries } from '../queries/channel.query';
import { useWorkspaceStore } from '../store/workspaceStore'; // 워크스페이스 store import 가정
import { useChannelStore } from '../stores/channel.store';

export const useChannelManagement = () => {
  const { currentWorkspaceId } = useWorkspaceStore();
  const { selectedChannel, setSelectedChannel, fetchedChannels, setFetchedChannels } = useChannelStore();
  const { 
    getChannels, 
    createChannel, 
    deleteChannel, 
    addProfileToChannel, 
    checkChannelExists 
  } = useChannelQueries(currentWorkspaceId);

  // getChannels 쿼리의 결과를 store에 저장
  if (getChannels.data) {
    setFetchedChannels(getChannels.data);
  }

  return {
    channels: fetchedChannels,
    isLoading: getChannels.isLoading,
    error: getChannels.error,
    selectedChannel,
    setSelectedChannel,
    createChannel: createChannel.mutate,
    deleteChannel: deleteChannel.mutate,
    addProfileToChannel: addProfileToChannel.mutate,
    checkChannelExists: checkChannelExists.mutateAsync,
    isCreatingChannel: createChannel.isPending,
    isDeletingChannel: deleteChannel.isPending,
    isAddingProfile: addProfileToChannel.isPending,
    isCheckingChannelExists: checkChannelExists.isPending,
  };
};