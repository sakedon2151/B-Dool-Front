import { useWebsocket } from "@/app/hooks/useWebsocket";
import { MessageInsertModel } from "@/app/models/message.model";
import { useChannelStore } from "@/app/stores/channel.store";
import { useProfileStore } from "@/app/stores/profile.store";
import { useCallback, useRef, useState, useEffect } from "react";
import { FaFileArrowUp } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";

export default function MessageInput() {
  const currentChannel = useChannelStore(state => state.currentChannel)  // Zustand Store
  const currentProfile = useProfileStore(state => state.currentProfile)
  const { sendMessage } = useWebsocket(currentChannel.channelId) // Stomp Websocket Hook
  
  const [message, setMessage] = useState<string>("")
  const textarea = useRef<HTMLTextAreaElement>(null);
  const MAX_MESSAGE_LENGTH = 100;
  
  const handleResizeHeight = useCallback(() => {
    if (textarea.current) {
      textarea.current.style.height = '3rem';
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, []);

  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.slice(0, MAX_MESSAGE_LENGTH);
    setMessage(newValue);
  };

  useEffect(() => {
    handleResizeHeight();
  }, [message, handleResizeHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      if (e.nativeEvent.isComposing === false) {
        e.preventDefault();
        handleSubmit();  
      }
    }
  };

  const handleSubmit = useCallback(async () => {
    if (message.trim() === '') return;
    const processedMessage: MessageInsertModel = {
      channelId: currentChannel.channelId,
      content: message.split('\n').map(line => line.trim()).join('\n').trim(),
      profileId: currentProfile.id
    }
    try {
      await sendMessage(processedMessage)
      setMessage('');
      if (textarea.current) {
        textarea.current.style.height = '3rem'
      }
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  }, [message, currentChannel.channelId, sendMessage]);

  return (
    <form className="flex gap-2 p-2" onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
      <div className="relative flex flex-grow w-full"> 
        <textarea 
          value={message} 
          maxLength={MAX_MESSAGE_LENGTH} 
          ref={textarea} 
          onChange={handleTextarea} 
          onKeyDown={handleKeyDown} 
          name="message" 
          className="w-full h-12 leading-8 resize-none textarea textarea-bordered max-h-36 " 
          placeholder="메시지를 입력하세요."
        ></textarea>
        <button type="submit" className="absolute bottom-0 right-0 w-[54px] h-[48px] flex items-center justify-center">
          <IoMdSend className="w-5 h-5"/>
        </button>
        <div className="text-xs text-gray-500 absolute bottom-0 right-[54px] h-[48px] leading-[48px]">
          {message.length}/{MAX_MESSAGE_LENGTH}
        </div>
      </div>
      
      <div className="tooltip tooltip-top" data-tip="파일 업로드">
        <button type="button" className="m-auto btn">
          <FaFileArrowUp className="w-5 h-5"/>
        </button>
      </div>
    </form>
  );
}