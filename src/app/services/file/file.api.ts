import { FileModel, FileUploadModel } from "@/app/models/file.model";
import { serverBAxios } from "../axiosInstance";

export const fileService = {
  
  // POST - /api/files/upload
  uploadFile: async (params: FileUploadModel): Promise<FileModel> => {
    const formData = new FormData();
    formData.append("file", params.file);
    formData.append("profileId", params.profileId);
    formData.append("channelId", params.channelId);
    formData.append("workspaceId", params.workspaceId);
    
    const response = await serverBAxios.post<FileModel>("/files/upload", formData, {
      headers: {"Content-Type": "multipart/form-data"} // file 업로드 헤더
    });
    return response.data;
  },

  // GET - /api/files
  getAllFiles: async (): Promise<FileModel[]> => {
    const response = await serverBAxios.get<FileModel[]>("/files");
    return response.data;
  },

  // GET - /api/files/download
  downloadFile: async (fileId: string): Promise<Blob> => {
    const response = await serverBAxios.get(`/files/download?fileId=${fileId}`, {
      responseType: "blob" // 다운로드 응답 blob
    });
    return response.data;
  },

  // DELETE - /api/files/delete/{fileId}
  deleteFile: async (fileId: string): Promise<void> => {
    await serverBAxios.delete(`/files/delete/${fileId}`);
  },

};
