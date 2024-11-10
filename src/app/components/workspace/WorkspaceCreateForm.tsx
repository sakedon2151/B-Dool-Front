import { ChangeEvent, useEffect, useRef, useState } from "react";
import { WorkspaceInsertModel } from "@/app/models/workspace.model"
import { useCheckWorkspaceUrl, useCreateWorkspace } from "@/app/queries/workspace.query";
import { getRandomWorkspaceImage } from "@/app/utils/randomDefaultImage";
import { useMemberStore } from "@/app/stores/member.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { fileService } from "@/app/services/file/file.service";

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

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInput = useRef<HTMLInputElement>(null);

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [shouldCheck, setShouldCheck] = useState<boolean>(false);
  const urlTimeoutRef = useRef<NodeJS.Timeout>();
  
  const createWorkspaceMutation = useCreateWorkspace(); // API Query
  const checkWorkspaceUrl = useCheckWorkspaceUrl(formData.workspaceUrl, shouldCheck); // API Query
  const currentMember = useMemberStore(state => state.currentMember); // Zustand Store

  const initializeImage = async () => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      const randomImage = getRandomWorkspaceImage();
      setFormData(prev => ({ ...prev, workspaceImage: randomImage }));
    } catch (error) {
      console.error('Failed to initialize workspace image:', error);
      toast.error("워크스페이스 이미지 초기화에 실패했습니다.")
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
      if (urlTimeoutRef.current) {
        clearTimeout(urlTimeoutRef.current);
      }
    };
  }, []);

  const handleImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // 파일 서버에 업로드
      const uploadedFile = await fileService.uploadFile({
        file,
        entityType: 'WORKSPACE'
      }, (progress) => {
        setUploadProgress(progress);
      });

      // 업로드된 파일의 경로를 프로필 이미지로 설정
      setFormData(prev => ({ 
        ...prev, 
        workspaceImage: uploadedFile.path 
      }));
    } catch (error) {
      console.error('워크스페이스 이미지 업로드 실패:', error);
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, workspaceUrl: value }));
    setIsTyping(true);
    setShouldCheck(false);
    // 이전 타이머 취소
    if (urlTimeoutRef.current) {
      clearTimeout(urlTimeoutRef.current);
    }
    // 새로운 타이머 설정
    urlTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setShouldCheck(true);
    }, 1000);
  };

  const getUrlCheckMessage = () => {
    if (!formData.workspaceUrl) return "";
    if (isTyping) return "URL 입력 중...";
    if (checkWorkspaceUrl.isLoading) return "URL 검증 중...";
    if (checkWorkspaceUrl.data === true) return "사용 가능한 URL입니다";
    if (checkWorkspaceUrl.data === false) return "이미 사용 중인 URL입니다";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.workspaceImage || !currentMember) return;
    if (isTyping || checkWorkspaceUrl.data === false) return;
    
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
        <div className="avatar group drop-shadow-sm" onClick={() => !isUploading && fileInput.current?.click()}>
          <div className="w-24 h-24 rounded-full bordered border-base-200 border-4">

            {isUploading ? (
              <div className="skeleton w-full h-full"/>
            ) : formData.workspaceImage ? (
              <img 
                src={formData.workspaceImage} 
                alt="workspace_image" 
                className="group-hover:brightness-50"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="text-center text-white">
                  <div className="loading loading-spinner loading-md"></div>
                  <div className="text-xs mt-1">{uploadProgress}%</div>
                </div>
              </div>
            )}

          </div>
          {!isUploading && (
            <FontAwesomeIcon 
              icon={faPlus} 
              className="w-8 h-8 absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
            />
          )}
        </div>
        <input 
          ref={fileInput}
          className="hidden"
          accept="image/png, image/jpg, image/jpeg"
          type="file" 
          onChange={handleImgChange}
        />
      </div>  

      <div className="bg-base-200 p-4 rounded-lg">
        <input
          type="text" 
          className="input input-bordered w-full mb-4" 
          placeholder="워크스페이스 이름"
          value={formData.workspaceName}
          onChange={(e) => setFormData(prev => ({ ...prev, workspaceName: e.target.value }))}
          required
        />

        <div className="mb-4 relative">
          <input
            type="text" 
            className="input input-bordered w-full" 
            placeholder="URL 지정(미지정 시 이름 등록)"
            value={formData.workspaceUrl}
            onChange={handleUrlChange}
          />
          {formData.workspaceUrl && (
            <div className={`text-sm absolute top-1/2 right-4 -translate-y-1/2 ${
              isTyping ? 'text-warning' :
              checkWorkspaceUrl.data === true ? 'text-success' : 
              checkWorkspaceUrl.data === false ? 'text-error' : 
              'text-warning'}`}
            >
              {getUrlCheckMessage()}
            </div>
          )}
        </div>

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
            className="btn btn-block bg-base-100" 
            disabled={
              createWorkspaceMutation.isPending ||
              isTyping || 
              checkWorkspaceUrl.data === false ||
              isUploading
            }
          >
            {createWorkspaceMutation.isPending ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : '다음'}
          </button>
        </div>
      </div>
    </form>
  )
}
