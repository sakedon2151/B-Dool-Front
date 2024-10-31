import React, { useState } from "react";
import { MessageModel } from "@/app/models/message.model";
import { useProfileById } from "@/app/queries/profile.query";
import { useProfileStore } from "@/app/stores/profile.store";
import { toMessageTime } from "@/app/utils/formatDateTime";
import { useTranslateMessage } from "@/app/queries/chatbot.query";

interface MessageBubbleProps {
  selectedMessage: MessageModel
}

export default function MessageBubble({selectedMessage}: MessageBubbleProps) {
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);

  const currentProfile = useProfileStore(state => state.currentProfile) // Zustand Store
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useProfileById(selectedMessage.profileId) // API Query
  const { mutate: translateMessage, isPending: isTranslating } = useTranslateMessage(); // API Query

  const isCurrentProfileMessage: boolean = selectedMessage.profileId === currentProfile.id;

  const isEnglishOnly = (text: string): boolean => {
    return /^[A-Za-z\s.,!?'"()-]+$/.test(text);
  };

  const handleTranslate = async () => {
    translateMessage({
      name: currentProfile.name,
      nickname: currentProfile.nickname,
      position: currentProfile.position,
      question: selectedMessage.content
    }, {
      onSuccess: (data) => {
        setTranslatedContent(data.answer)
      },
      onError: (error) => {
        console.error("번역 오류:", error)
      }
    })
  }

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
        <div>알 수 없는 오류가 발생했습니다.</div>
      ) : !profile ? (
        <div>데이터를 불러오지 못했습니다.</div>
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
            {/* {renderMessageContent(selectedMessage.content)} */}
            {renderMessageContent(translatedContent || selectedMessage.content)}
            {isEnglishOnly(selectedMessage.content) && !translatedContent && (
              <button
                onClick={handleTranslate}
                disabled={isTranslating}
                className="absolute bottom-0 right-0 -mb-6 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
              >
                {isTranslating ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    번역중...
                  </>
                ) : (
                  '번역하기'
                )}
              </button>
            )}
          </div>
          <div className="chat-footer">메시지 읽은 사람</div>
        </>
      )}
    </div>
  );
}
