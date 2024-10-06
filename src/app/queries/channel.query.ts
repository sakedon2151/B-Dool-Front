import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChannelModel } from '../models/channel.model';
import { channelService } from '../services/channel/channel.service';

export const channelKeys = {
  all: ['channels'] as const,
  lists: () => [...channelKeys.all, 'list'] as const,
  list: (workspaceId: number) => [...channelKeys.lists(), workspaceId] as const,
  details: () => [...channelKeys.all, 'detail'] as const,
  detail: (id: number) => [...channelKeys.details(), id] as const,
};

export const useChannelQueries = (workspaceId: number) => {
  const queryClient = useQueryClient();

  const getChannels = useQuery({
    queryKey: channelKeys.list(workspaceId),
    queryFn: () => channelService.getChannelsByWorkspaceId(workspaceId),
    enabled: !!workspaceId,
  });

  const createChannel = useMutation({
    mutationFn: (channelData: ChannelModel) => channelService.createChannel(channelData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
    },
  });

  const deleteChannel = useMutation({
    mutationFn: (channelId: number) => channelService.deleteChannel(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
    },
  });

  const addProfileToChannel = useMutation({
    mutationFn: ({ channelId, profileId }: { channelId: string, profileId: string }) => 
      channelService.addProfileToChannel(channelId, profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
    },
  });

  const checkChannelExists = useMutation({
    mutationFn: (channelId: number) => channelService.checkChannelExists(channelId),
  });

  return {
    getChannels,
    createChannel,
    deleteChannel,
    addProfileToChannel,
    checkChannelExists,
  };
};