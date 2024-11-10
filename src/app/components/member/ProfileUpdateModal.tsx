import { ChangeEvent, useCallback, useRef, useState } from "react";
import { useProfileStore } from "@/app/stores/profile.store";
import { useUpdateProfile, useUpdateProfileOnlineStatus } from "@/app/queries/profile.query";
import { ProfileModel } from "@/app/models/profile.model";
import { toCreatedAt, toUpdatedAt } from "@/app/utils/formatDateTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { fileService } from "@/app/services/file/file.service";
import toast from "react-hot-toast";

export default function ProfileUpdateModal() {
  const currentProfile = useProfileStore(state => state.currentProfile) // Zustand Store
  const setCurrentProfile = useProfileStore(state => state.setCurrentProfile)  // Zustand Store
  
  const updateProfileMutation = useUpdateProfile(); // API Query
  const updateProfileOnlineStatusMutation = useUpdateProfileOnlineStatus(); // API Query
  
  const [editingProfile, setEditingProfile] = useState<ProfileModel | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const fileInput = useRef<HTMLInputElement>(null)

  const profileData = editingProfile ?? currentProfile;

  const formatCreatedDate = toCreatedAt(currentProfile.createdAt)
  const formatUpdatedDate = toUpdatedAt(currentProfile.updatedAt, currentProfile.createdAt)

  const handleImgChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return
    try {
      setIsUploading(true);
      setUploadProgress(0);
      // 파일 업로드를 위한 FormData 구성
      const formData = new FormData();
      formData.append('file', file);
      // 파일 서버에 업로드
      const uploadedFile = await fileService.uploadFile({
        file,
        entityType: 'PROFILE'
      }, (progress) => {
        setUploadProgress(progress);
      });
      // 프로필 정보 업데이트
      const updatedProfile = {
        ...profileData,
        profileImgUrl: uploadedFile.path
      };
      await updateProfileMutation.mutateAsync({
        profileId: currentProfile.id,
        data: updatedProfile
      });
      setCurrentProfile(updatedProfile);
      setEditingProfile(updatedProfile);
    } catch (error) {
      console.error("프로필 이미지 변경 실패:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [profileData, currentProfile.id, updateProfileMutation, setCurrentProfile]);

  const handleOnlineToggle = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const newOnlineStatus = e.target.checked;
    try {
      await updateProfileOnlineStatusMutation.mutateAsync({
        profileId: currentProfile.id,
        isOnline: newOnlineStatus
      });
      const updatedProfile = {
        ...profileData,
        isOnline: newOnlineStatus
      };
      setCurrentProfile(updatedProfile);
      setEditingProfile(updatedProfile);
      toast.success(newOnlineStatus ? "온라인" : "오프라인");
    } catch (error) {
      console.error("온라인 상태 변경 실패:", error);
      toast.error('온라인 상태 변경에 실패했습니다.');
      e.target.checked = profileData.isOnline;
    }
  }, [profileData, currentProfile.id, updateProfileOnlineStatusMutation, setCurrentProfile]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingProfile(prev => ({
      ...(prev ?? currentProfile),
      [name]: value
    }));
  }, [currentProfile]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData = {
        name: editingProfile?.name ?? currentProfile.name,
        nickname: editingProfile?.nickname ?? currentProfile.nickname,
        position: editingProfile?.position ?? currentProfile.position,
        profileImgUrl: editingProfile?.profileImgUrl ?? currentProfile.profileImgUrl
      };
      await updateProfileMutation.mutateAsync({
        profileId: currentProfile.id,
        data: updateData
      });
      const updatedProfile = {
        ...currentProfile,
        ...editingProfile
      };
      setCurrentProfile(updatedProfile);
      setEditingProfile(null);
      setIsEditing(false);
      console.log("프로필이 업데이트 되었습니다.");
      toast.success('프로필이 업데이트 되었습니다.');
    } catch (error) {
      console.error("프로필 업데이트 실패:", error);
      toast.error('프로필 업데이트에 실패했습니다.');
    }
  }, [currentProfile, editingProfile, updateProfileMutation, setCurrentProfile]);

  const handleCancel = useCallback(() => {
    setEditingProfile(null);
    setIsEditing(false);
  }, []);

  return (
    <div className="flex flex-col ">
      <div className="h-24 mb-4 text-center">
        <div 
          className={`avatar group drop-shadow-sm ${profileData.isOnline ? 'online' : 'offline'}`} 
          onClick={() => !isUploading && fileInput.current?.click()}
        >
          <div className="w-24 h-24 rounded-full bordered border-base-200 border-4">
            {profileData.profileImgUrl ? (
              <img 
                src={profileData.profileImgUrl}
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
          disabled={isUploading}
        />
      </div>
      
      <div className="bg-base-200 p-4 rounded-lg">
        {!isEditing ? (
          <div className="info">
            <div className="flex justify-between">
              <p className="text-lg font-bold">{currentProfile.nickname}</p>
              <div className="tooltip tooltip-bottom" data-tip="온라인 상태">
                <input 
                  type="checkbox"
                  className="toggle toggle-success"
                  onChange={handleOnlineToggle}
                  checked={profileData.isOnline}
                />
              </div>
            </div>
            <p className="text-lg font-bold opacity-75">{profileData.name}</p>
            <p className="text-base font-normal">{profileData.email}</p>  
            <p className="text-base font-normal mb-4">{profileData.status}</p>
            <button 
              className="bg-base-100 btn btn-block" 
              onClick={() => {
                setEditingProfile(currentProfile);
                setIsEditing(true);
              }}
            >
              프로필 수정
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="nickname"
              value={profileData.nickname}
              placeholder="닉네임" 
              className="input w-full mb-4"
              onChange={handleChange}
              required
            />
            <input 
              type="text" 
              name="name"
              value={profileData.name}
              placeholder="성명"
              className="input w-full mb-4" 
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="position"
              value={profileData.position}
              placeholder="직책/직무"
              className="input w-full mb-4"
              onChange={handleChange}
            />
            <div className="flex justify-between">
              <button 
                type="button" 
                className="bg-base-100 btn w-[calc(50%-8px)] mr-2" 
                onClick={handleCancel}
              >
                취소하기
              </button>
              <button 
                type="submit" 
                className="bg-base-100 btn w-[calc(50%-8px)] ml-2"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner"/>
                    저장 중...
                  </> 
                ) : '저장하기'}
              </button>
            </div>
          </form>
        )}
        <p className="font-bold text-xs opacity-50 text-center mt-4">
          마지막 프로필 수정일 - {formatUpdatedDate}
        </p>
      </div>
      <p className="font-bold text-xs opacity-50 text-right mt-4">
        워크스페이스 참가일 - {formatCreatedDate}
      </p>
    </div>
  );
}
