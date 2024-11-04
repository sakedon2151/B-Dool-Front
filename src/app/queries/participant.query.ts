import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ParticipantModel } from "@/app/models/participant.model";
import { participantService } from '../services/channel/participant.service';

// Query keys
export const PARTICIPANT_KEYS = {
  all: ['participants'] as const,
  byId: (id: string) => [...PARTICIPANT_KEYS.all, 'byId', id] as const,
  byChannelId: (channelId: string) => [...PARTICIPANT_KEYS.all, 'byChannelId', channelId] as const,
};

// Queries
export const useAllParticipants = () => 
  useQuery({
    queryKey: PARTICIPANT_KEYS.all,
    queryFn: participantService.getAllParticipants,
  });

export const useParticipantById = (participantId: string) => 
  useQuery({
    queryKey: PARTICIPANT_KEYS.byId(participantId),
    queryFn: () => participantService.getParticipantById(participantId),
  });

export const useParticipantsByChannelId = (channelId: string) =>
  useQuery({
    queryKey: PARTICIPANT_KEYS.byChannelId(channelId),
    queryFn: () => participantService.getParticipantsByChannelId(channelId),
  })

// Mutations
export const useCreateParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ParticipantModel) => participantService.createParticipant(data),
    onSuccess: (newParticipant) => {
      queryClient.invalidateQueries({ queryKey: PARTICIPANT_KEYS.all });
      queryClient.setQueryData(PARTICIPANT_KEYS.byId(newParticipant.participantId), newParticipant);
    },
  });
};

export const useUpdateParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ participantId, data }: { participantId: string; data: ParticipantModel }) => 
      participantService.updateParticipant(participantId, data),
    onSuccess: (updatedParticipant, { participantId }) => {
      queryClient.invalidateQueries({ queryKey: PARTICIPANT_KEYS.byId(participantId) });
      queryClient.invalidateQueries({ queryKey: PARTICIPANT_KEYS.all });
    },
  });
};

export const useDeleteParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: participantService.deleteParticipant,
    onSuccess: (_, deletedParticipantId) => {
      queryClient.invalidateQueries({ queryKey: PARTICIPANT_KEYS.all });
      queryClient.removeQueries({ queryKey: PARTICIPANT_KEYS.byId(deletedParticipantId) });
    },
  });
};