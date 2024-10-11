import { WorkspaceInsertModel, WorkspaceModel, WorkspaceUpdateModel } from "@/app/models/workspace.model";
import { serverCAxios } from "../../utils/axiosInstance";

const BASE_URL = '/workspaces';

export const workspaceService = {

  // ----- queries -----

  // workspaceId 로 workspace 요청
  getWorkspaceById: (workspaceId: number) => 
    serverCAxios.get<WorkspaceModel>(`${BASE_URL}/${workspaceId}`)
      .then(response => response.data),

  // workspaceIds 로 workspaces 요청
  getWorkspacesByIds: (workspaceIds: number[]) => 
    serverCAxios.post<WorkspaceModel[]>(`${BASE_URL}/list`, workspaceIds)
      .then(response => response.data),

  // ----- mutations -----

  // workspace 생성 요청
  createWorkspace: (data: WorkspaceInsertModel) => 
    serverCAxios.post<WorkspaceModel>(`${BASE_URL}/new-workspace`, data)
      .then(response => response.data),

  // workspace 수정 요청
  updateWorkspace: (workspaceId: number, data: WorkspaceUpdateModel) => 
    serverCAxios.put<WorkspaceModel>(`${BASE_URL}/${workspaceId}`, data)
      .then(response => response.data),

  // workspace 삭제 요청
  deleteWorkspace: (workspaceId: number) => 
    serverCAxios.delete(`${BASE_URL}/${workspaceId}`)
      .then(response => response.data),

  // checkWorkspaceUrl: (url: string) => 
  //   serverCAxios.get<boolean>(`${BASE_URL}/check-url`, {
  //     params: { url }
  //   }).then(response => response.data),
  
  // getAllWorkspaces: () => 
  //   serverCAxios.get<WorkspaceModel[]>(`${BASE_URL}/list`)
  //     .then(response => response.data),

};