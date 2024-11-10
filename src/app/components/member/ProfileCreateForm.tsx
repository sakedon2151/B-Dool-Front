import { ProfileInsertModel } from "@/app/models/profile.model"
import { fileService } from "@/app/services/file/file.service";
import { getRandomProfileImage } from "@/app/utils/randomDefaultImage";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface ProfileCreateFormProps {
  onSubmit: (data: ProfileInsertModel) => void;
  onPrevious: () => void;
}

export default function ProfileCreateForm({ onSubmit, onPrevious }: ProfileCreateFormProps) {
  const [formData, setFormData] = useState({
    profileName: '',
    profileNickname: '',
    profilePosition: '',
    profileImage: null as string | null
  })
  
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInput = useRef<HTMLInputElement>(null);

  const initializeImage = async () => {
    try {
      setIsUploading(true);
      const randomImage = getRandomProfileImage();
      setFormData(prev => ({ ...prev, profileImage: randomImage }));
    } catch (error) {
      console.error('이미지 초기화 실패:', error);
      toast.error("프로필 이미지 초기화에 실패했습니다.")
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    initializeImage();
    return () => {
      setFormData({
        profileName: '',
        profileNickname: '',
        profileImage: null,
        profilePosition: ''
      });
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
        entityType: 'PROFILE'
      }, (progress) => {
        setUploadProgress(progress);
      });
      // 업로드된 파일의 경로를 프로필 이미지로 설정
      setFormData(prev => ({ 
        ...prev, 
        profileImage: uploadedFile.path 
      }));
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.profileImage) return;
    const profileData: ProfileInsertModel = {
      name: formData.profileName,
      nickname: formData.profileNickname,
      profileImgUrl: formData.profileImage,
      position: formData.profilePosition,
      workspaceId: 0,
      isWorkspaceCreator: false
    };
    onSubmit(profileData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 text-center">
        <div className="avatar group drop-shadow-sm" onClick={() => isUploading && fileInput.current?.click()}>
          <div className="w-24 h-24 rounded-full bordered border-base-200 border-4">

            {formData.profileImage ? (
              <div className="skeleton w-full h-full"/>
            ) : formData.profileImage ? (
              <img 
                src={formData.profileImage} 
                alt="profile_image" 
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
          placeholder="프로필 닉네임"
          value={formData.profileNickname}
          onChange={(e) => setFormData(prev => ({ ...prev, profileNickname: e.target.value }))}
          required
        />
        <input
          type="text" 
          className="input input-bordered w-full mb-4" 
          placeholder="이름"
          value={formData.profileName}
          onChange={(e) => setFormData(prev => ({ ...prev, profileName: e.target.value }))}
          required
        />
        <input
          type="text" 
          className="input input-bordered w-full mb-4" 
          placeholder="직무/직위"
          value={formData.profilePosition}
          onChange={(e) => setFormData(prev => ({ ...prev, profilePosition: e.target.value }))}
          required
        />

        <div className="w-full justify-center">
          <button type="button" onClick={onPrevious} className="btn w-[calc(50%-8px)] mr-2 bg-base-100">이전</button>
          <button 
            type="submit" 
            className="btn w-[calc(50%-8px)] ml-2 bg-base-100" 
            disabled={!formData.profileImage || isUploading}
          >
            완료
          </button>
        </div>
      </div>
    </form>
  )
}
