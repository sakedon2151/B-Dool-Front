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
  const [workspaceName, setWorkspaceName] = useState<string>('');
  const [workspaceInfo, setWorkspaceInfo] = useState<string>('');
  const [workspaceUrl, setWorkspaceUrl] = useState<string>('');
  const [workspaceImage, setWorkspaceImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const fileInput = useRef<HTMLInputElement>(null);
  
  const createWorkspaceMutation = useCreateWorkspace(); // API Query
  const currentMember = useMemberStore(state => state.currentMember); // Zustand Store

  useEffect(() => {
    setIsLoading(true);
    setWorkspaceImage(getRandomWorkspaceImage());
    setIsLoading(false);
  }, []);

  const resetForm = () => {
    setWorkspaceName('')
    setWorkspaceInfo('')
    setWorkspaceUrl('')
    setIsLoading(true);
    setWorkspaceImage(getRandomWorkspaceImage());
    setIsLoading(false);
  }

  useEffect(() => {
    return () => {
      resetForm()
    }
  }, [])
  
  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsLoading(true);
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setWorkspaceImage(e.target.result as string)
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file)
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const workspaceData: WorkspaceInsertModel = {
      name: workspaceName,
      description: workspaceInfo,
      workspaceImageUrl: workspaceImage,
      url: workspaceUrl,
      ownerId: currentMember.id
    }
    onSubmit(workspaceData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 text-center">
        <div className="avatar group drop-shadow-sm" onClick={() => fileInput.current?.click()}>
          <div className="w-24 h-24 rounded-full bordered border-base-200 border-4">

            {isLoading ? (
              <div className="skeleton w-full h-full"></div>
            ) : (
              <img src={workspaceImage} alt="workspace_image" className="group-hover:brightness-50"/>
            )}

          </div>
          <FontAwesomeIcon icon={faPlus} className="w-8 h-8 absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"/>
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
        value={workspaceName}
        onChange={(e) => setWorkspaceName(e.target.value)}
        required
      />
      <input
        type="text" 
        className="input input-bordered w-full mb-4" 
        placeholder="URL 지정(미지정 시 이름 등록)"
        value={workspaceUrl}
        onChange={(e) => setWorkspaceUrl(e.target.value)}
      />
      <textarea
        className="textarea textarea-bordered resize-none w-full mb-4" 
        placeholder="워크스페이스 정보"
        value={workspaceInfo}
        maxLength={50}
        onChange={(e) => setWorkspaceInfo(e.target.value)}
      />
      <div className="text-center">
        <button type="submit" className="btn" disabled={createWorkspaceMutation.isPending}>
          {createWorkspaceMutation.isPending ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : '다음'}
        </button>
      </div>
    </form>
  )
}
