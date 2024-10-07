import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkspaceModel } from "@/app/models/workspace.model";
import { workspaceService } from '../services/workspace/workspace.service';

// Query keys
const WORKSPACE_KEYS = {
  all: ['workspaces'] as const,
  byId: (id: number) => [...WORKSPACE_KEYS.all, 'byId', id] as const,
  list: (ids: number[]) => [...WORKSPACE_KEYS.all, 'list', ids] as const,
};

// Queries
export const useWorkspaceById = (workspaceId: number) => 
  useQuery({
    queryKey: WORKSPACE_KEYS.byId(workspaceId),
    queryFn: () => workspaceService.getWorkspaceById(workspaceId),
  });

export const useWorkspacesByIds = (workspaceIds: number[]) => 
  useQuery({
    queryKey: WORKSPACE_KEYS.list(workspaceIds),
    queryFn: () => workspaceService.getWorkspacesByIds(workspaceIds),
  });

// Mutations
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkspaceModel) => workspaceService.createWorkspace(data),
    onSuccess: (newWorkspace) => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all });
      queryClient.setQueryData(WORKSPACE_KEYS.byId(newWorkspace.id), newWorkspace);
    },
  });
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: number; data: WorkspaceModel }) => 
      workspaceService.updateWorkspace(workspaceId, data),
    onSuccess: (updatedWorkspace) => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all });
      queryClient.setQueryData(WORKSPACE_KEYS.byId(updatedWorkspace.id), updatedWorkspace);
    },
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workspaceService.deleteWorkspace,
    onSuccess: (_, deletedWorkspaceId) => {
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.all });
      queryClient.removeQueries({ queryKey: WORKSPACE_KEYS.byId(deletedWorkspaceId) });
    },
  });
};