import { FileModel, FileUploadModel } from "@/app/models/file.model";
import { serverBAxios } from "../../utils/axiosInstance";

const BASE_URL = '/files';

export const fileService = {
  uploadFile: async (params: FileUploadModel & { file: File }, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append("file", params.file);
    formData.append("entityType", params.entityType);
    
    const response = await serverBAxios.post<FileModel>(`${BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent_1) => {
        if (onProgress && progressEvent_1.total) {
          const progress_1 = Math.round((progressEvent_1.loaded * 100) / progressEvent_1.total);
          onProgress(progress_1);
        }
      }
    });
    return response.data;
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