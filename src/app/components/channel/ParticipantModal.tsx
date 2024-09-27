import { profileService } from "@/app/services/profile/profile.api";
import { useEffect, useState } from "react";

interface ParticipantModalProps {
  profileId: number;
}

export default function ParticipantModal({ profileId }: ParticipantModalProps) {
  const [selectedProfile, setSelectedProfile] = useState<ProfileModalModel | null>(null);
  const getOnlineStatus = (isOnline: boolean) => isOnline ? 'online' : 'offline';

  useEffect(() => {
    fetchProfile(profileId)
  }, [profileId])

  const fetchProfile = async (profileId: number) => {
    try {
      const response = await profileService.getProfileModal(profileId);
      setSelectedProfile(response);
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }
  
  return (
    <div>
      <div className="flex items-center gap-4">
        <div className={`avatar ${getOnlineStatus(selectedProfile?.isOnline ?? false)}`}>
          <div className="w-12 h-12 rounded-full">
            <img src={selectedProfile?.profileImgUrl} alt="profile_image"/>
          </div>
        </div>
        <div>
          <p className="text-lg font-bold">{selectedProfile?.nickname}</p>
          <p className="text-nowrap">{selectedProfile?.position}</p>
        </div>
        <div className="w-full text-right">
          <p>{selectedProfile?.status}</p>
        </div>
      </div>
      <div className="my-0 divider"></div>
      <div className="mb-4">
        <p>성함: {selectedProfile?.name}</p>
        <p>이메일: {selectedProfile?.email}</p>
      </div>
      <button className="w-full btn">Direct Message</button>
    </div>
  );
}
