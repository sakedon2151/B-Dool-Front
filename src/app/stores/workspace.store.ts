import { create } from "zustand";
import {  InitialWorkspace, WorkspaceModel } from "../models/workspace.model";

interface WorkspaceStore {
  currentWorkspace: WorkspaceModel;
  setCurrentWorkspace: (workspace: WorkspaceModel) => void;
  fetchedWorkspaces: WorkspaceModel[];
  setFetchedWorkspaces: (workspaces: WorkspaceModel[]) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  currentWorkspace: InitialWorkspace,
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  fetchedWorkspaces: [],
  setFetchedWorkspaces: (workspaces) => set({ fetchedWorkspaces: workspaces }),
}));
