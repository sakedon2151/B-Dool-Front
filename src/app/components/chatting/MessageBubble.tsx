import { MessageModel } from "@/app/models/message.model";
import { toMessageTime } from "@/app/utils/formatDateTime";

import React from "react";
import { useEffect, useState } from "react";

interface MessageBubbleProps {
  selectedMessage: MessageModel
}

export default function MessageBubble({selectedMessage}: MessageBubbleProps) {
  // const [findedProfile, setFindedProfile] = useState<ProfileModel>()
  // const currentProfileId = 1 // 추후 store 를 통해 현재 로그인 대상 프로필 id 대입
  // const isCurrentProfileMessage: boolean = assignedMessage.profileId === currentProfileId;

  const isCurrentProfileMessage = false

  // useEffect(() => { // profile 더미데이터 id find,
  //   const matchingProfile = dummyProfiles.find(profile => profile.id === assignedMessage.profileId);
  //   setFindedProfile(matchingProfile || null);
  // }, [assignedMessage.profileId])

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`chat ${isCurrentProfileMessage ? 'chat-end' : 'chat-start'} py-2`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="profile_img"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
        </div>
      </div>
      
      <div className="chat-header">
        {/* {findedProfile.nickname} */}
        name
        <time className="pl-1 text-xs opacity-50">{toMessageTime(selectedMessage.sendDate)}</time>
      </div>
      
      <div className="chat-bubble">
        {renderMessageContent(selectedMessage.content)}
      </div>
      
      <div className="chat-footer">3</div>
    </div>
  );
}
