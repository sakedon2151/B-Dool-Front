import {  InitialWorkspace, WorkspaceModel } from "../models/workspace.model";
import { setWorkspaceMetadata } from "../utils/cookieController";
import { createPersistStore } from "./session.middleware";

interface WorkspaceState {
  currentWorkspace: WorkspaceModel;
  setCurrentWorkspace: (workspace: WorkspaceModel) => void;
  fetchedWorkspaces: WorkspaceModel[];
  setFetchedWorkspaces: (workspaces: WorkspaceModel[]) => void;
}

export const useWorkspaceStore = createPersistStore<WorkspaceState>(
  (set) => ({
    currentWorkspace: InitialWorkspace,
    setCurrentWorkspace: (workspace) => {
      set({ currentWorkspace: workspace })
      setWorkspaceMetadata(workspace); // metadata cookie update
    },
    fetchedWorkspaces: [],
    setFetchedWorkspaces: (workspaces) => set({ fetchedWorkspaces: workspaces }),
  }),
  'workspace-storage'
);
