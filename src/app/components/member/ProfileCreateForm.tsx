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
  const [profileName, setProfileName] = useState<string>('')
  const [profileNickname, setProfileNickname] = useState<string>('')
  const [profileImage, setProfileImage] = useState<string>('')
  const [profilePosition, setProfilePosition] = useState<string>('')
  
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setProfileImage(getRandomProfileImage());
    setIsLoading(false);
  }, []);

  const resetForm = () => {
    setProfileName('')
    setProfileNickname('')
    setProfilePosition('')
    setIsLoading(true);
    setProfileImage(getRandomProfileImage());
    setIsLoading(false);
  }

  useEffect(() => {
    return () => {
      resetForm()
    }
  }, [])

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true)
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profileData: ProfileInsertModel = {
      name: profileName,
      nickname: profileNickname,
      profileImgUrl: profileImage,
      position: profilePosition,
      workspaceId: 0,
    }
    onSubmit(profileData)
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 text-center">
        <div className="avatar group drop-shadow-sm" onClick={() => fileInput.current?.click()}>
          <div className="w-24 h-24 rounded-full bordered border-base-200 border-4">

            {isLoading ? (
              <div className="skeleton w-full h-full"></div>
            ) : (
              <img src={profileImage} alt="profile_image" className="group-hover:brightness-50"/>
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
        placeholder="프로필 닉네임"
        value={profileNickname}
        onChange={(e) => setProfileNickname(e.target.value)}
        required
      />
      <input
        type="text" 
        className="input input-bordered w-full mb-4" 
        placeholder="이름"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        required
      />
      <input
        type="text" 
        className="input input-bordered w-full mb-4" 
        placeholder="직무/직위"
        value={profilePosition}
        onChange={(e) => setProfileName(e.target.value)}
        required
      />

      <div className="w-full join justify-center">
        <button type="button" onClick={onPrevious} className="btn join-item">이전</button>
        <button type="submit" className="btn join-item">완료</button>
      </div>
    </form>
  )
}
