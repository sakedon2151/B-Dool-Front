
import { ChangeEvent, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import UpdateProfile from "./UpdateProfile";


export default function ProfileModal() {
  // 프롭스로 들어온 profileImgUrl 대입할것 // ?
  // profile store
  const [profileImage, setProfileImage] = useState<string>("https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp")
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const fileInput = useRef<HTMLInputElement>(null)
  
  const profileId = 1

  const handleImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const newProfileImage = e.target.result as string;
          setProfileImage(newProfileImage);
          try {
            await profileService.updateProfile(profileId, updatedProfileModel);
            console.log("Profile image updated successfully");
          } catch (error) {
            console.error("Error updating profile image:", error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 온라인 상태 변경 함수
  const handleOnlineToggle = async (e: ChangeEvent<HTMLInputElement>) => {
    const newOnlineStatus = e.target.checked;
    setIsOnline(newOnlineStatus);
    try {
      console.log(isOnline)
      await profileService.updateProfileOnlineStatus(profileId, isOnline);
      console.log("Online status updated successfully");
    } catch (error) {
      console.error("Error updating online status:", error);
    }
  };

  return (
    <div className="flex flex-col ">
      
      <div className="h-24 mb-4 text-center">
        <div className="avatar online group drop-shadow-sm" onClick={() => {fileInput.current?.click()}}>
          <div className="w-24 h-24 rounded-full">
            <img src={profileImage} alt="profile_image" className="group-hover:brightness-50"/>
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
      
      <div className="bg-base-200 p-4 rounded-lg">

        <div className="info">
          <div className="flex justify-between">
            <p className="text-2xl font-bold">sakedon2151</p>
            <div className="tooltip tooltip-bottom" data-tip="온라인 상태">
              <input 
                type="checkbox"
                className="toggle"
                checked={isOnline}
                onChange={handleOnlineToggle}
                defaultChecked={true}
              />
            </div>
          </div>
          <p className="text-lg font-bold opacity-75">박상민</p>
          <p className="text-base font-normal">이메일 - abc@gmail.com</p>  
          <p className="text-base font-normal mb-4">프론트엔드 개발팀</p>
          <button className="bg-base-300 btn rounded-btn w-full">프로필 수정</button>
        </div>
        
        <UpdateProfile onCancel={() => setIsEditing(false)}/>
        
        <p className="font-bold text-xs opacity-50 text-center mt-4">마지막 프로필 수정일 - 2024.10.01</p>
      </div>

      <p className="font-bold text-xs opacity-50 text-right mt-4">워크스페이스 참가일 - 2024.09.24</p>
    
    </div>
  );
}
