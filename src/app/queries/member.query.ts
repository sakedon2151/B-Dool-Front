import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '../services/member/member.service';

// Query keys
const MEMBER_KEYS = {
  all: ['members'] as const,
  byId: (id: number) => [...MEMBER_KEYS.all, 'byId', id] as const,
  byEmail: (email: string) => [...MEMBER_KEYS.all, 'byEmail', email] as const,
  byToken: ['members', 'byToken'] as const,
};

// Queries
export const useMemberById = (memberId: number) => 
  useQuery({
    queryKey: MEMBER_KEYS.byId(memberId),
    queryFn: () => memberService.getMemberById(memberId),
  });

export const useMemberByEmail = (email: string) => 
  useQuery({
    queryKey: MEMBER_KEYS.byEmail(email),
    queryFn: () => memberService.getMemberByEmail(email),
  });

export const useCurrentMember = () => 
  useQuery({
    queryKey: MEMBER_KEYS.byToken,
    queryFn: () => memberService.getCurrentMember(),
  });

// Mutations
export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => memberService.createMember(email),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.all });
      queryClient.setQueryData(MEMBER_KEYS.byId(data.id), data);
      queryClient.setQueryData(MEMBER_KEYS.byEmail(data.email), data);
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: memberService.deleteMember,
    onSuccess: (_, memberId) => {
      queryClient.invalidateQueries({ queryKey: MEMBER_KEYS.all });
      queryClient.removeQueries({ queryKey: MEMBER_KEYS.byId(memberId) });
    },
  });
};