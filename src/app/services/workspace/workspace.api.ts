import { WorkspaceModel } from "@/app/models/workspace.model";
import { serverCAxios } from "../axiosInstance";

export const workspaceService = {

  // GET /api/workspaces/{workspaceId}
  getWorkspaceById: async (workspaceId: number): Promise<WorkspaceModel> => {
    const response = await serverCAxios.get<WorkspaceModel>(`/workspaces/${workspaceId}`);
    return response.data;
  },

  // PUT /api/workspaces/{workspaceId}
  updateWorkspace: async (workspaceId: number, data: WorkspaceModel): Promise<WorkspaceModel> => {
    const response = await serverCAxios.put<WorkspaceModel>(`/workspaces/${workspaceId}`, data);
    return response.data;
  },

  // DELETE /api/workspaces/{workspaceId}
  deleteWorkspace: async (workspaceId: number): Promise<void> => {
    await serverCAxios.delete(`/workspaces/${workspaceId}`);
  },

  // POST /api/workspaces/new-workspace
  createWorkspace: async (data: WorkspaceModel): Promise<WorkspaceModel> => {
    const response = await serverCAxios.post<WorkspaceModel>('/workspaces/new-workspace', data);
    return response.data;
  },

  // GET /api/workspaces/list
  getWorkspaceList: async (): Promise<WorkspaceModel[]> => {
    const response = await serverCAxios.get<WorkspaceModel[]>('/workspaces/list');
    return response.data;
  },

  // POST /api/workspaces/list
  getFilteredWorkspaceList: async (filters: any): Promise<WorkspaceModel[]> => {
    const response = await serverCAxios.post<WorkspaceModel[]>('/workspaces/list', filters);
    return response.data;
  },

  // GET /api/workspaces/check-url
  checkWorkspaceUrl: async (url: string): Promise<boolean> => {
    const response = await serverCAxios.get<boolean>(`/workspaces/check-url?url=${encodeURIComponent(url)}`);
    return response.data;
  }

};
