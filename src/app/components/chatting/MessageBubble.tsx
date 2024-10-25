import React from "react";
import { MessageModel } from "@/app/models/message.model";
import { useProfileById } from "@/app/queries/profile.query";
import { useProfileStore } from "@/app/stores/profile.store";
import { toMessageTime } from "@/app/utils/formatDateTime";


interface MessageBubbleProps {
  selectedMessage: MessageModel
}

export default function MessageBubble({selectedMessage}: MessageBubbleProps) {
  const currentProfile = useProfileStore(state => state.currentProfile) // Zustand Store
  const isCurrentProfileMessage: boolean = selectedMessage.profileId === currentProfile.id;
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useProfileById(selectedMessage.profileId) // API Query

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`chat ${isCurrentProfileMessage ? 'chat-end' : 'chat-start'} my-2`}>
      {isLoadingProfile ? (
        <div className="skeleton w-28 h-10"></div>
      ) : profileError ? (
        <div className="">에러가 발생했습니다.</div>
      ) : !profile ? (
        <div className="">프로필을 불러 올 수 없습니다.</div>
      ) : (
        <>
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img src={profile.profileImgUrl} alt="profile_image"/>
            </div>
          </div>

          <div className="chat-header">
            {profile.nickname}
            <time className="pl-1 text-xs opacity-75">{toMessageTime(selectedMessage.sendDate)}</time>
          </div>

          <div className="chat-bubble">
            {renderMessageContent(selectedMessage.content)}
          </div>

          <div className="chat-footer">메시지 읽은 사람</div>
        </>
      )}
    </div>
  );
}
