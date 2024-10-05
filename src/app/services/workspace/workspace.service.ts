import { WorkspaceModel } from "@/app/models/workspace.model";
import { serverCAxios } from "../../utils/axiosInstance";

const BASE_URL = '/workspaces';

export const workspaceService = {
  getWorkspaceById: (workspaceId: number) => 
    serverCAxios.get<WorkspaceModel>(`${BASE_URL}/${workspaceId}`)
      .then(response => response.data),

  updateWorkspace: (workspaceId: number, data: WorkspaceModel) => 
    serverCAxios.put<WorkspaceModel>(`${BASE_URL}/${workspaceId}`, data)
      .then(response => response.data),

  deleteWorkspace: (workspaceId: number) => 
    serverCAxios.delete(`${BASE_URL}/${workspaceId}`)
      .then(response => response.data),

  createWorkspace: (data: WorkspaceModel) => 
    serverCAxios.post<WorkspaceModel>(`${BASE_URL}/new-workspace`, data)
      .then(response => response.data),

  getWorkspaceList: () => 
    serverCAxios.get<WorkspaceModel[]>(`${BASE_URL}/list`)
      .then(response => response.data),

  getFilteredWorkspaceList: (filters: any) => 
    serverCAxios.post<WorkspaceModel[]>(`${BASE_URL}/list`, filters)
      .then(response => response.data),

  checkWorkspaceUrl: (url: string) => 
    serverCAxios.get<boolean>(`${BASE_URL}/check-url`, {
      params: { url }
    }).then(response => response.data),
};