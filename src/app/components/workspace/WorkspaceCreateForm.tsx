import { ChangeEvent, useEffect, useRef, useState } from "react";
import { WorkspaceInsertModel } from "@/app/models/workspace.model"
import { useCreateWorkspace } from "@/app/queries/workspace.query";
import { getRandomWorkspaceImage } from "@/app/utils/randomDefaultImage";
import { useMemberStore } from "@/app/stores/member.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface WorkspaceCreateFormProps {
  onSubmit: (data: WorkspaceInsertModel) => void
}

export default function WorkspaceCreateForm({ onSubmit }: WorkspaceCreateFormProps) {
  const [formData, setFormData] = useState({
    workspaceName: '',
    workspaceInfo: '',
    workspaceUrl: '',
    workspaceImage: null as string | null
  });

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const fileInput = useRef<HTMLInputElement>(null);
  
  const createWorkspaceMutation = useCreateWorkspace(); // API Query
  const currentMember = useMemberStore(state => state.currentMember); // Zustand Store

  const initializeImage = async () => {
    try {
      setIsLoading(true);
      const randomImage = getRandomWorkspaceImage();
      setFormData(prev => ({ ...prev, workspaceImage: randomImage }));
    } catch (error) {
      console.error('Failed to initialize workspace image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeImage();
    return () => {
      setFormData({
        workspaceName: '',
        workspaceInfo: '',
        workspaceUrl: '',
        workspaceImage: null
      });
    };
  }, []);

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        if (result) {
          setFormData(prev => ({ ...prev, workspaceImage: result }));
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.workspaceImage || !currentMember) return;
    const workspaceData: WorkspaceInsertModel = {
      name: formData.workspaceName,
      description: formData.workspaceInfo,
      workspaceImageUrl: formData.workspaceImage,
      url: formData.workspaceUrl,
      ownerId: currentMember.id
    };
    onSubmit(workspaceData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 text-center">
        <div className="avatar group drop-shadow-sm" onClick={() => fileInput.current?.click()}>
          <div className="w-24 h-24 rounded-full bordered border-base-200 border-4">

            {isLoading ? (
              <div className="skeleton w-full h-full"/>
            ) : formData.workspaceImage ? (
              <img 
                src={formData.workspaceImage} 
                alt="workspace_image" 
                className="group-hover:brightness-50"
              />
            ) : (
              <div className="bg-gray-200 w-full h-full rounded-full" />
            )}

          </div>
          <FontAwesomeIcon 
            icon={faPlus} 
            className="w-8 h-8 absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
          />
        </div>
        <input 
          ref={fileInput}
          className="hidden"
          accept="image/png, image/jpg, image/jpeg"
          type="file" 
          onChange={handleImgChange}
        />
      </div>  

      <input
        type="text" 
        className="input input-bordered w-full mb-4" 
        placeholder="워크스페이스 이름"
        value={formData.workspaceName}
        onChange={(e) => setFormData(prev => ({ ...prev, workspaceName: e.target.value }))}
        required
      />
      <input
        type="text" 
        className="input input-bordered w-full mb-4" 
        placeholder="URL 지정(미지정 시 이름 등록)"
        value={formData.workspaceUrl}
        onChange={(e) => setFormData(prev => ({ ...prev, workspaceUrl: e.target.value }))}
      />
      <textarea
        className="textarea textarea-bordered resize-none w-full mb-4" 
        placeholder="워크스페이스 정보"
        value={formData.workspaceInfo}
        maxLength={50}
        onChange={(e) => setFormData(prev => ({ ...prev, workspaceInfo: e.target.value }))}
      />

      <div className="text-center">
        <button 
          type="submit" 
          className="btn" 
          disabled={createWorkspaceMutation.isPending}
        >
          {createWorkspaceMutation.isPending ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : '다음'}
        </button>
      </div>
    </form>
  )
}
