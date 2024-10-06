import { create } from "zustand";
import { WorkspaceModel } from "../models/workspace.model";

interface WorkspaceStore {
  currentWorkspace: WorkspaceModel | null;
  setCurrentWorkspace: (workspace: WorkspaceModel) => void;
  
  fetchedWorkspaces: WorkspaceModel[];
  setFetchedWorkspaces: (workspaces: WorkspaceModel[]) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  currentWorkspace: null,
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  
  fetchedWorkspaces: [],
  setFetchedWorkspaces: (workspaces) => set({ fetchedWorkspaces: workspaces }),
}));
