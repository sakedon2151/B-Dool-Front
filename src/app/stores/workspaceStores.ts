import { create } from "zustand";
import { WorkspaceModel } from "../models/workspace.model";

interface FetchedWorkspaceListStore {
  fetchedWorkspaceList: WorkspaceModel[];
  setFetchedWorkspaceList: (workspaces: WorkspaceModel[]) => void;
  clearFetchedWorkspaceList: () => void;
}

export const useWorkspaceStore = create<FetchedWorkspaceListStore>((set) => ({
  fetchedWorkspaceList: [],
  setFetchedWorkspaceList: (workspaces) => set({ fetchedWorkspaceList: workspaces }),
  clearFetchedWorkspaceList: () => set({ fetchedWorkspaceList: [] }),
}));
