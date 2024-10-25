import { useCallback, useRef, useState, useEffect } from "react";
import { useWebsocket } from "@/app/hooks/useWebsocket";
import { MessageInsertModel } from "@/app/models/message.model";
import { fileService } from "@/app/services/file/file.service";
import { useChannelStore } from "@/app/stores/channel.store";
import { useProfileStore } from "@/app/stores/profile.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPaperPlane, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";

interface MessageInputProps {
  workspaceId: number
}

interface SelectedFile {
  file: File;
  previewUrl?: string;  // 이미지인 경우 미리보기 URL
}

export default function MessageInput({ workspaceId }: MessageInputProps) {
  const currentChannel = useChannelStore(state => state.currentChannel)  // Zustand Store
  const currentProfile = useProfileStore(state => state.currentProfile) // Zustand Store
  const { sendMessage } = useWebsocket(currentChannel.channelId, workspaceId) // Stomp Websocket Hook

  const [message, setMessage] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);

  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null)
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

  const handleFileButtonClick = () => {
    fileInput.current?.click();
  };


  // 파일 선택 처리
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (예: 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("파일 크기는 100MB를 초과할 수 없습니다.");
      return;
    }

    // 이미지 파일인 경우 미리보기 URL 생성
    let previewUrl: string | undefined;
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
    }

    setSelectedFile({ file, previewUrl });
    
    // 파일 input 초기화
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  };

  // 선택된 파일 제거
  const handleRemoveFile = () => {  
    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }
    setSelectedFile(null);
  };

  // 메시지와 파일 전송
  const handleSubmit = useCallback(async () => {
    if (message.trim() === '' && !selectedFile) return;
    try {
      setIsUploading(true);
      let fileUrl: string | undefined;

      // 파일이 있으면 먼저 업로드
      if (selectedFile) {
        const uploadedFile = await fileService.uploadFile({
          file: selectedFile.file,
          entityType: 'MESSAGE',
          entityId: ''
        }, (progress) => {
          setUploadProgress(progress);
        });
        fileUrl = uploadedFile.path;
      }

      sendMessage({
        channelId: currentChannel.channelId,
        content: message.split('\n').map(line => line.trim()).join('\n').trim() || `[파일] ${selectedFile?.file.name}`,
        profileId: currentProfile.id,
        fileUrl: fileUrl,
      })

      setMessage('');
      handleRemoveFile();
      if (textarea.current) {
        textarea.current.style.height = '3rem'
      }
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [message, selectedFile, currentChannel.channelId, sendMessage]);

  return (
    <div className="flex flex-col">
      {/* 선택된 파일 미리보기 */}
      {selectedFile && (
        <div className="flex items-center gap-2 mx-2 mt-2 p-2 bg-base-200 rounded-lg">
          {selectedFile.previewUrl ? (
            <img 
              src={selectedFile.previewUrl} 
              alt="preview" 
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-base-300 rounded">
              <FontAwesomeIcon icon={faFile} />
            </div>
          )}
          <div className="flex-grow">
            <div className="text-sm font-medium">{selectedFile.file.name}</div>
            <div className="text-xs text-gray-500">
              {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
          <button 
            onClick={handleRemoveFile}
            className="btn btn-ghost btn-sm"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}
      
      <div className="flex gap-2 p-2">
        <form className="flex-grow" onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
          <div className="relative flex "> 
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
              <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 opacity-75"/>
            </button>
            <div className="text-xs text-gray-500 absolute bottom-0 right-[54px] h-[48px] leading-[48px]">
              {message.length}/{MAX_MESSAGE_LENGTH}
            </div>
          </div>
        </form>

        <input
          type="file"
          ref={fileInput}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />

        <div className="tooltip tooltip-top" data-tip="업로드">
          <button 
            type="button"
            className="btn w-12 h-full"
            onClick={handleFileButtonClick}
            disabled={isUploading || selectedFile !== null}
          >
            {isUploading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <FontAwesomeIcon icon={faUpload} className="w-4 h-4 opacity-75"/>
            )}
          </button>
        </div>
      </div>
    </div>

  );
}