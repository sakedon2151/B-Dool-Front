import React, { useState } from "react";
import { MessageModel } from "@/app/models/message.model";
import { useProfileById } from "@/app/queries/profile.query";
import { useProfileStore } from "@/app/stores/profile.store";
import { toMessageTime } from "@/app/utils/formatDateTime";
import { usePapagoMessage } from "@/app/queries/naver.query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faExternalLink, faFile, faFileAudio, faFileImage, faFileVideo, faLanguage } from "@fortawesome/free-solid-svg-icons";

interface MessageBubbleProps {
  selectedMessage: MessageModel
}

export default function MessageBubble({selectedMessage}: MessageBubbleProps) {
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState<boolean>(false);

  const currentProfile = useProfileStore(state => state.currentProfile) // Zustand Store
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useProfileById(selectedMessage.profileId) // API Query
  const { mutate: papagoMessage, isPending: isTranslating } = usePapagoMessage(); // API Query
  
  const isCurrentProfileMessage: boolean = selectedMessage.profileId === currentProfile.id;

  const isEnglishOnly = (text: string): boolean => {
    return /^[A-Za-z\s.,!?'"()-]+$/.test(text);
  };

  const handleTranslate = async () => {
    papagoMessage({
      source: "en",
      target: "ko",
      text: selectedMessage.content
    }, {
      onSuccess: (data) => {
        setTranslatedContent(data.message.result.translatedText)
        setShowOriginal(false);
      },
      onError: (error) => {
        console.error("번역 오류:", error)
      }
    })
  }

  const toggleOriginal = () => {
    setShowOriginal(!showOriginal);
  };

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getFileIcon = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    switch(extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return faFileImage;
      case 'mp4':
      case 'mov':
      case 'avi':
        return faFileVideo;
      case 'mp3':
      case 'wav':
        return faFileAudio;
      default:
        return faFile;
    }
  };

  const isImageFile = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension || '');
  };

  const renderFileContent = () => {
    if (!selectedMessage.fileUrl) return null;
    return (
      <div className="mt-2 flex flex-col gap-2">
        {isImageFile(selectedMessage.fileUrl) ? (
          <div className="relative">
            <img 
              src={selectedMessage.fileUrl} 
              alt="첨부 이미지" 
              className="max-w-80 rounded-lg"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <a 
                href={selectedMessage.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-circle btn-sm bg-base-100 bg-opacity-70 hover:bg-opacity-100"
                title="새 탭에서 보기"
              >
                <FontAwesomeIcon icon={faExternalLink} />
              </a>
              <a 
                href={selectedMessage.fileUrl} 
                download 
                className="btn btn-circle btn-sm bg-base-100 bg-opacity-70 hover:bg-opacity-100"
                title="다운로드"
                onClick={(e) => e.stopPropagation()}
              >
                <FontAwesomeIcon icon={faDownload} />
              </a>
            </div>
          </div>
        ) : (
          <a 
            href={selectedMessage.fileUrl} 
            download 
            className="flex items-center gap-2 bg-base-200 p-2 rounded-lg hover:bg-base-300 transition-colors"
          >
            <FontAwesomeIcon icon={getFileIcon(selectedMessage.fileUrl)} className="text-lg" />
            <span className="text-sm truncate max-w-[200px]">
              {selectedMessage.fileUrl.split('/').pop()}
            </span>
            <FontAwesomeIcon icon={faDownload} className="ml-auto" />
          </a>
        )}
      </div>
    );
  };

  return (
    <div className={`chat ${isCurrentProfileMessage ? "chat-end" : "chat-start"} my-1`}>
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
          </div>

          <div className="branch-wrap flex gap-2">
            <div className="branch flex flex-col justify-end whitespace-nowrap">
              <p className="text-sm">5</p>
              <time className="text-xs opacity-75">
                {toMessageTime(selectedMessage.sendDate)}
              </time>
            </div>
            
            <div className="chat-bubble">
              {renderMessageContent(showOriginal ? selectedMessage.content : translatedContent || selectedMessage.content)}
              {renderFileContent()}
            </div>
          </div>

          <div className="chat-footer flex items-center gap-1 mt-1">
            {translatedContent && !showOriginal && (
              <p className="text-xs text-gray-500">(번역됨)</p>
            )}

            {isEnglishOnly(selectedMessage.content) && !translatedContent && (
              <button
                onClick={handleTranslate}
                disabled={isTranslating}
                className="btn btn-xs bg-base-300"
              >
                {isTranslating ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    번역중...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faLanguage}/>
                    번역하기
                  </>
                )}
              </button>
            )}
            {translatedContent && (
              <button onClick={toggleOriginal} className="btn btn-xs">
                {showOriginal ? "번역문 보기" : "원문 보기"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
