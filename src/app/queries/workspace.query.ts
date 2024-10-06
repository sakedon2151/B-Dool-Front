import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkspaceModel } from '../models/workspace.model';
import { workspaceService } from '../services/workspace/workspace.service';

export const workspaceKeys = {
  all: ['workspaces'] as const,
  lists: () => [...workspaceKeys.all, 'list'] as const,
  list: (filters: any) => [...workspaceKeys.lists(), filters] as const,
  details: () => [...workspaceKeys.all, 'detail'] as const,
  detail: (id: number) => [...workspaceKeys.details(), id] as const,
};

export const useWorkspaceQueries = () => {
  const queryClient = useQueryClient();

  const getWorkspaceList = useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: () => workspaceService.getWorkspaceList(),
  });

  const getFilteredWorkspaceList = (filters: any) => useQuery({
    queryKey: workspaceKeys.list(filters),
    queryFn: () => workspaceService.getFilteredWorkspaceList(filters),
  });

  const getWorkspaceById = (workspaceId: number) => useQuery({
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: () => workspaceService.getWorkspaceById(workspaceId),
    enabled: !!workspaceId,
  });

  const createWorkspace = useMutation({
    mutationFn: (data: WorkspaceModel) => workspaceService.createWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });

  const updateWorkspace = useMutation({
    mutationFn: ({ workspaceId, data }: { workspaceId: number; data: WorkspaceModel }) => 
      workspaceService.updateWorkspace(workspaceId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(data.id) });
    },
  });

  const deleteWorkspace = useMutation({
    mutationFn: (workspaceId: number) => workspaceService.deleteWorkspace(workspaceId),
    onSuccess: (_, workspaceId) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.detail(workspaceId) });
    },
  });

  const checkWorkspaceUrl = useMutation({
    mutationFn: (url: string) => workspaceService.checkWorkspaceUrl(url),
  });

  return {
    getWorkspaceList,
    getFilteredWorkspaceList,
    getWorkspaceById,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    checkWorkspaceUrl,
  };
};