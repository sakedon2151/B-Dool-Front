import { ChangeEvent, useEffect, useRef, useState } from "react";
import { WorkspaceInsertModel } from "@/app/models/workspace.model"
import { useCreateWorkspace } from "@/app/queries/workspace.query";
import { DEFAULT_WORKSPACE_IMAGE } from "@/app/utils/config";
import { FaPlus } from 'react-icons/fa';

interface WorkspaceCreateFormProps {
  onSubmit: (data: WorkspaceInsertModel) => void
}

export default function WorkspaceCreateForm({ onSubmit }: WorkspaceCreateFormProps) {
  const [workspaceName, setWorkspaceName] = useState<string>('');
  const [workspaceInfo, setWorkspaceInfo] = useState<string>('');
  const [workspaceUrl, setWorkspaceUrl] = useState<string>('');
  const [workspaceImage, setWorkspaceImage] = useState<string>(DEFAULT_WORKSPACE_IMAGE);
  const fileInput = useRef<HTMLInputElement>(null);
  
  const createWorkspaceMutation = useCreateWorkspace(); // API Query

  const resetForm = () => {
    setWorkspaceName('')
    setWorkspaceInfo('')
    setWorkspaceUrl('')
    setWorkspaceImage(DEFAULT_WORKSPACE_IMAGE)
  }

  useEffect(() => {
    return () => {
      resetForm()
    }
  }, [])
  
  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setWorkspaceImage(e.target.result as string)
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
      ownerId: 0
    }
    onSubmit(workspaceData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 text-center">
        <div className="avatar group drop-shadow-sm" onClick={() => fileInput.current?.click()}>
          <div className="w-24 h-24 rounded-full">
            <img src={workspaceImage} alt="workspace_image" className="group-hover:brightness-50"/>
          </div>
          <FaPlus className="w-8 h-8 absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"/>
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
        placeholder="워크스페이스 도메인(선택)"
        value={workspaceUrl}
        onChange={(e) => setWorkspaceUrl(e.target.value)}
      />
      <textarea
        className="textarea textarea-bordered resize-none w-full mb-4" 
        placeholder="워크스페이스 정보"
        maxLength={50}
        value={workspaceInfo}
        onChange={(e) => setWorkspaceInfo(e.target.value)}
      />
      <div className="text-center">
        <button type="submit" className="btn" disabled={createWorkspaceMutation.isPending}>
          {createWorkspaceMutation.isPending ? '생성 중...' : '다음'}
        </button>
      </div>
    </form>
  )
}
