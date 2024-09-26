import { useEffect, useState } from "react";

interface MessageProps {
  assignedMessage: MessageModel
}

export default function ChannelMessage({assignedMessage}: MessageProps) {
  // const [findedProfile, setFindedProfile] = useState<ProfileModel>()
  // const currentProfileId = 1 // 추후 store 를 통해 현재 로그인 대상 프로필 id 대입
  // const isCurrentProfileMessage: boolean = assignedMessage.profileId === currentProfileId;

  const isCurrentProfileMessage = false

  // useEffect(() => { // profile 더미데이터 id find,
  //   const matchingProfile = dummyProfiles.find(profile => profile.id === assignedMessage.profileId);
  //   setFindedProfile(matchingProfile || null);
  // }, [assignedMessage.profileId])

  return (
    <div className={`chat ${isCurrentProfileMessage ? 'chat-end' : 'chat-start'} py-2`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          {/* <img
            alt="profile_img"
            src={findedProfile.profileImgUrl}
          /> */}
        </div>
      </div>
      <div className="chat-header">
        {/* {findedProfile.nickname} */}
        <time className="text-xs opacity-50 pl-1">{assignedMessage.createdAt}</time>
      </div>
      <div className="chat-bubble">{assignedMessage.content}</div>
      {/* <div className="chat-footer">3</div> */}
    </div>
  );
}
