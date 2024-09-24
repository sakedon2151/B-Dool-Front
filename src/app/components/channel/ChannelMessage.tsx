import dummyProfiles from "@/app/tests/dummyProfiles";
import { formatDateToMessageTime } from "@/app/utils/formatDate";
import { useEffect, useState } from "react";

interface MessageProps {
  assignedMessage: MessageModel
}

export default function ChannelMessage({assignedMessage}: MessageProps) {
  const [joinProfile, setJoinProfile] = useState<ProfileModel | null>(null)

  const currentProfileId = 1 // 추후 JWT 를 통해 현재 로그인 대상 프로필 id 요청 및 대입
  const isCurrentProfileMessage: boolean = assignedMessage.profileId === currentProfileId;

  useEffect(() => { // profile 더미데이터 id find,
    const matchingProfile = dummyProfiles.find(profile => profile.id === assignedMessage.profileId);
    setJoinProfile(matchingProfile || null);
  }, [assignedMessage.profileId])

  if (!joinProfile) return null; // 프로필정보가 조회되지 않았을 경우 예외처리

  return (
    <div className={`chat ${isCurrentProfileMessage ? 'chat-end' : 'chat-start'} py-2`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="profile_img"
            src={joinProfile.profileImgUrl}
          />
        </div>
      </div>
      <div className="chat-header">
        {joinProfile.nickname}
        <time className="text-xs opacity-50 pl-1">{formatDateToMessageTime(assignedMessage.createdAt)}</time>
      </div>
      <div className="chat-bubble">{assignedMessage.content}</div>
      {/* <div className="chat-footer">3</div> */}
    </div>
  );
}
