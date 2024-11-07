import { ProfileInsertModel } from "@/app/models/profile.model"
import { getRandomProfileImage } from "@/app/utils/randomDefaultImage";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useRef, useState } from "react";

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
  
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const fileInput = useRef<HTMLInputElement>(null);

  const initializeImage = async () => {
    try {
      setIsLoading(true);
      const randomImage = getRandomProfileImage();
      setFormData(prev => ({ ...prev, profileImage: randomImage }));
    } catch (error) {
      console.error('이미지 초기화 실패:', error);
    } finally {
      setIsLoading(false);
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
  
  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        if (result) {
          setFormData(prev => ({ ...prev, profileImage: result }));
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
        <div className="avatar group drop-shadow-sm" onClick={() => fileInput.current?.click()}>
          <div className="w-24 h-24 rounded-full bordered border-base-200 border-4">

            {isLoading ? (
              <div className="skeleton w-full h-full"/>
            ) : formData.profileImage ? (
              <img 
                src={formData.profileImage} 
                alt="profile_image" 
                className="group-hover:brightness-50"
              />
            ) : (
              <div className="bg-gray-200 w-full h-full rounded-full"/>
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

      <div className="w-full join justify-center">
        <button type="button" onClick={onPrevious} className="btn join-item">이전</button>
        <button 
          type="submit" 
          className="btn join-item" 
          disabled={!formData.profileImage}
        >
          완료
        </button>
      </div>
    </form>
  )
}
