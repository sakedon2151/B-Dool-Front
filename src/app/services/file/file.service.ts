import { FileModel, FileUploadModel } from "@/app/models/file.model";
import { serverBAxios } from "../../utils/axiosInstance";

const BASE_URL = '/files';

export const fileService = {
  uploadFile: (params: FileUploadModel) => {
    const formData = new FormData();
    formData.append("file", params.file);
    formData.append("profileId", params.profileId);
    formData.append("channelId", params.channelId);
    formData.append("workspaceId", params.workspaceId);
    
    return serverBAxios.post<FileModel>(`${BASE_URL}/upload`, formData, {
      headers: {"Content-Type": "multipart/form-data"}
    }).then(response => response.data);
  },

  getAllFiles: () => 
    serverBAxios.get<FileModel[]>(BASE_URL)
      .then(response => response.data),

  downloadFile: (fileId: string) => 
    serverBAxios.get(`${BASE_URL}/download?fileId=${fileId}`, {
      responseType: "blob"
    }).then(response => response.data),

  deleteFile: (fileId: string) => 
    serverBAxios.delete(`${BASE_URL}/delete/${fileId}`)
};