
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useProfileStore } from "@/app/stores/profile.store";
import { useUpdateProfile, useUpdateProfileOnlineStatus } from "@/app/queries/profile.query";
import { formatKoreanTime } from "@/app/utils/formatDateTime";
import { ProfileModel } from "@/app/models/profile.model";

export default function ProfileModal() {
  const currentProfile = useProfileStore(state => state.currentProfile) // Zustand Store
  
  const updateProfileMutation = useUpdateProfile(); // API Query
  const updateProfileOnlineStatusMutation = useUpdateProfileOnlineStatus(); // API Query
  
  const [profileImage, setProfileImage] = useState<string>(currentProfile.profileImgUrl)
  const [isOnline, setIsOnline] = useState<boolean>(currentProfile.isOnline);
  const [formData, setFormData] = useState<ProfileModel>(currentProfile);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const fileInput = useRef<HTMLInputElement>(null)
  
  const formatCreatedDate = formatKoreanTime(currentProfile.createdAt)
  const formatUpdatedDate = formatKoreanTime(currentProfile.updatedAt)

  // 프로필 이미지 변경 함수
  // const handleImgChange = async (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = async (e: ProgressEvent<FileReader>) => {
  //       if (e.target?.result) {
  //         const newProfileImage = e.target.result as string;
  //         setProfileImage(newProfileImage);
  //         try {
  //           await updateProfileMutation.mutateAsync({
  //             profileId: currentProfile.id,
  //             data: {
  //               ...currentProfile,
  //               profileImgUrl: profileImage
  //             }
  //           })
  //         } catch (error) {
  //           console.log("프로필 이미지 변경 실패: ", error)
  //         }
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImgChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const newProfileImage = e.target.result as string;
          setProfileImage(newProfileImage);
          try {
            await updateProfileMutation.mutateAsync({
              profileId: currentProfile.id,
              data: {
                ...currentProfile,
                profileImgUrl: newProfileImage
              }
            });
          } catch (error) {
            console.log("프로필 이미지 변경 실패: ", error);
            setProfileImage(currentProfile.profileImgUrl);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }, [currentProfile, updateProfileMutation]);

  // 프로필 온라인 상태 변경 함수
  // const handleOnlineToggle = async (e: ChangeEvent<HTMLInputElement>) => {
  //   const newOnlineStatus = e.target.checked;
  //   setIsOnline(newOnlineStatus);
  //   try {
  //     await updateProfileOnlineStatusMutation.mutateAsync({
  //       profileId: currentProfile.id,
  //       isOnline: isOnline
  //     });
  //   } catch (error) {
  //     console.error("온라인 상태 변경 실패: ", error);
  //   }
  // };

  const handleOnlineToggle = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const newOnlineStatus = e.target.checked;
    try {
      await updateProfileOnlineStatusMutation.mutateAsync({
        profileId: currentProfile.id,
        isOnline: newOnlineStatus
      });
      setIsOnline(newOnlineStatus);
    } catch (error) {
      console.error("온라인 상태 변경 실패: ", error);
      e.target.checked = isOnline;
    }
  }, [currentProfile.id, isOnline, updateProfileOnlineStatusMutation]);

  // 업데이트 폼 수정 함수
  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prevData => ({
  //     ...prevData,
  //     [name]: value
  //   }));
  // };

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }, []);

  // 업데이트 폼 요청 함수
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   await updateProfileMutation.mutateAsync({
  //     profileId: currentProfile.id,
  //     data: formData,
  //   });
  //   setIsEditing(false);
  // };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({
        profileId: currentProfile.id,
        data: formData,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("프로필 업데이트 실패: ", error);
      // 에러 처리 로직 (예: 사용자에게 알림)
    }
  }, [currentProfile.id, formData, updateProfileMutation]);

  // 업데이트 폼 초기화 함수
  // const handleCancel = () => {
  //   setFormData(currentProfile);
  //   setIsEditing(false);
  // };

  const handleCancel = useCallback(() => {
    setFormData(currentProfile);
    setIsEditing(false);
  }, [currentProfile]);

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
        {!isEditing ? (
          <div className="info">
            <div className="flex justify-between">
              <p className="text-2xl font-bold">{currentProfile.nickname}</p>
              <div className="tooltip tooltip-bottom" data-tip="온라인 상태">
                <input 
                  type="checkbox"
                  className="toggle"
                  onChange={handleOnlineToggle}
                  checked={isOnline}
                />
              </div>
            </div>
            <p className="text-lg font-bold opacity-75">{currentProfile.name}</p>
            <p className="text-base font-normal">{currentProfile.email}</p>  
            <p className="text-base font-normal mb-4">{currentProfile.status}</p>
            <button className="bg-base-300 btn rounded-btn w-full" onClick={() => setIsEditing(true)}>프로필 수정</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="nickname"
              value={formData.nickname}
              placeholder="닉네임" 
              className="input w-full mb-4"
              onChange={handleChange}
            />
            <input 
              type="text" 
              name="name"
              value={formData.name}
              placeholder="실명" 
              className="input w-full mb-4" 
              onChange={handleChange}
            />
            <input
              type="text"
              name="position"
              value={formData.position}
              placeholder="직책"
              className="input w-full mb-4"
              onChange={handleChange}
            />
            <div className="flex justify-between">
              <button type="button" className="bg-base-300 btn rounded-btn w-[calc(50%-8px)] mr-2" onClick={handleCancel}>취소하기</button>
              <button type="submit" className="bg-base-300 btn rounded-btn w-[calc(50%-8px)] ml-2">저장하기</button>
            </div>
          </form>
        )}
        <p className="font-bold text-xs opacity-50 text-center mt-4">마지막 프로필 수정일 - {formatUpdatedDate}</p>
      </div>
      <p className="font-bold text-xs opacity-50 text-right mt-4">워크스페이스 참가일 - {formatCreatedDate}</p>
    </div>
  );
}
