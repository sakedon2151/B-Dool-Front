import { useQuery, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { ChannelInsertModel } from "@/app/models/channel.model";
import { channelService } from '../services/channel/channel.service';

// Query keys
const CHANNEL_KEYS = {
  all: ['channels'] as const,
  byId: (id: string) => [...CHANNEL_KEYS.all, 'byId', id] as const,
  byWorkspaceId: (workspaceId: number) => [...CHANNEL_KEYS.all, 'byWorkspaceId', workspaceId] as const,
  defaultByWorkspaceId: (workspaceId: number) => [...CHANNEL_KEYS.all, 'defaultByWorkspaceId', workspaceId] as const,
};

// Queries
export const useChannelsByWorkspaceId = (workspaceId: number) => 
  useQuery({
    queryKey: CHANNEL_KEYS.byWorkspaceId(workspaceId),
    queryFn: () => channelService.getChannelsByWorkspaceId(workspaceId),
    // refetchOnMount: 'always', // SSE 연결시 고려할 것
  });

export const useChannelById = (channelId: string) => 
  useQuery({
    queryKey: CHANNEL_KEYS.byId(channelId),
    queryFn: () => channelService.getChannelById(channelId),
  });

// Suspense
export const useDefaultChannelByWorkspaceId = (workspaceId: number, options = {}) =>
  useSuspenseQuery({
    queryKey: CHANNEL_KEYS.defaultByWorkspaceId(workspaceId),
    queryFn: () => channelService.getDefaultChannelByWorkspaceId(workspaceId),
    ...options
  });

// Mutations
export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (channelData: ChannelInsertModel) => channelService.createChannel(channelData),
    onSuccess: (newChannel) => {
      queryClient.invalidateQueries({ queryKey: CHANNEL_KEYS.all });
      queryClient.setQueryData(CHANNEL_KEYS.byId(newChannel.channelId), newChannel);
      
      if (newChannel.workspacesId) {
        queryClient.invalidateQueries({ 
          queryKey: CHANNEL_KEYS.byWorkspaceId(newChannel.workspacesId) 
        });
      }
    },
  });
};

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ channelId, profileId }: { channelId: string; profileId: number }) => 
      channelService.updateChannel(channelId, profileId),
    onSuccess: (_, { channelId }) => {
      queryClient.invalidateQueries({ queryKey: CHANNEL_KEYS.byId(channelId) });
      queryClient.invalidateQueries({ queryKey: CHANNEL_KEYS.all });
    },
  });
};

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: channelService.deleteChannel,
    onSuccess: (_, deletedChannelId) => {
      queryClient.invalidateQueries({ queryKey: CHANNEL_KEYS.all });
      queryClient.removeQueries({ queryKey: CHANNEL_KEYS.byId(deletedChannelId) });
    },
  });
};