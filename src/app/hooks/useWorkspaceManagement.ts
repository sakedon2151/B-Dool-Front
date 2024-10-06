import { useWorkspaceQueries } from "../queries/workspace.query";
import { useWorkspaceStore } from "../stores/workspace.store";

export const useWorkspaceManagement = () => {
  const { currentWorkspace, setCurrentWorkspace, fetchedWorkspaces, setFetchedWorkspaces } = useWorkspaceStore();
  const { 
    getWorkspaceList,
    getFilteredWorkspaceList,
    getWorkspaceById,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    checkWorkspaceUrl
  } = useWorkspaceQueries();

  // getWorkspaceList 쿼리의 결과를 store에 저장
  if (getWorkspaceList.data) {
    setFetchedWorkspaces(getWorkspaceList.data);
  }

  return {
    workspaces: fetchedWorkspaces,
    isLoading: getWorkspaceList.isLoading,
    error: getWorkspaceList.error,
    currentWorkspace,
    setCurrentWorkspace,
    getFilteredWorkspaceList,
    getWorkspaceById,
    createWorkspace: createWorkspace.mutate,
    updateWorkspace: updateWorkspace.mutate,
    deleteWorkspace: deleteWorkspace.mutate,
    checkWorkspaceUrl: checkWorkspaceUrl.mutateAsync,
    isCreatingWorkspace: createWorkspace.isPending,
    isUpdatingWorkspace: updateWorkspace.isPending,
    isDeletingWorkspace: deleteWorkspace.isPending,
    isCheckingWorkspaceUrl: checkWorkspaceUrl.isPending,
  };
};