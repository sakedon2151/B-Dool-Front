import { useCallback, useRef, useState, useEffect } from "react";
import { useWebsocket } from "@/app/hooks/useWebsocket";
import { fileService } from "@/app/services/file/file.service";
import { useChannelStore } from "@/app/stores/channel.store";
import { useProfileStore } from "@/app/stores/profile.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPaperPlane, faUpload } from "@fortawesome/free-solid-svg-icons";

interface MessageInputProps {
  workspaceId: number
}

interface SelectedFile {
  file: File;
  previewUrl?: string;
  uploadError?: string;
}

export default function MessageInput({ workspaceId }: MessageInputProps) {
  const currentProfile = useProfileStore(state => state.currentProfile) // Zustand Store
  const currentChannel = useChannelStore(state => state.currentChannel)  // Zustand Store
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("파일 크기는 100MB를 초과할 수 없습니다.");
      return;
    }
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

  const handleRemoveFile = () => {  
    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleSubmit = useCallback(async () => {
    if (message.trim() === '' && !selectedFile) return;
    if (isUploading) return;
    if (selectedFile) {
      try {
        setIsUploading(true);
        const uploadedFile = await fileService.uploadFile({
          file: selectedFile.file,
          entityType: 'MESSAGE'
        }, (progress) => {
          setUploadProgress(progress);
        });
        const trimmedMessage = message.split('\n').map(line => line.trim()).join('\n').trim();
        const messageData = {
          channelId: currentChannel.channelId,
          content: trimmedMessage || `[파일] ${selectedFile.file.name}`,
          profileId: currentProfile.id,
          fileUrl: uploadedFile.path
        };
        sendMessage(messageData)
        setMessage('');
        handleRemoveFile();
        if (textarea.current) {
          textarea.current.style.height = '3rem'
        }
      } catch (error) {
        console.error("메시지 전송 실패:", error);
        setSelectedFile(prev => 
          prev ? { ...prev, uploadError: "파일 업로드에 실패했습니다." } : null
        );
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    } else {
      const trimmedMessage = message.split('\n').map(line => line.trim()).join('\n').trim();
      sendMessage({
        channelId: currentChannel.channelId,
        content: trimmedMessage,
        profileId: currentProfile.id,
        fileUrl: undefined,
      })
      setMessage('');
      if (textarea.current) {
        textarea.current.style.height = '3rem';
      }
    }
  }, [message, selectedFile, currentChannel.channelId, sendMessage, isUploading]);

  return (
    <div className="flex flex-col">
      {selectedFile && (
        <div className="flex items-center gap-2 mx-2 mt-2 p-2 bg-base-200 rounded-lg">
          {selectedFile.previewUrl ? (
            <img 
              src={selectedFile.previewUrl} 
              alt="preview_image" 
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-base-300 rounded">
              <FontAwesomeIcon icon={faFile} className="w-4 h-4 opacity-75"/>
            </div>
          )}
          <div className="flex-grow">
            <p className="text-sm font-medium">{selectedFile.file.name}</p>
            <div className="flex flex-col">
              <p className="text-xs text-gray-500">
                {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {isUploading && (
                <div className="w-full bg-base-300 rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              {selectedFile.uploadError && (
                <p className="text-xs text-error">{selectedFile.uploadError}</p>
              )}
            </div>
          </div>
          <button 
            className="btn btn-circle btn-ghost btn-sm" 
            onClick={handleRemoveFile}
            disabled={isUploading}
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="flex gap-2 p-2">
        <form className="flex-grow" onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
          <div className="relative flex"> 
            <textarea 
              value={message} 
              maxLength={MAX_MESSAGE_LENGTH} 
              ref={textarea} 
              onChange={handleTextarea} 
              onKeyDown={handleKeyDown} 
              name="message" 
              className="w-full h-12 leading-8 resize-none textarea textarea-bordered max-h-36 scrollbar-none" 
              placeholder="메시지를 입력하세요."
              disabled={isUploading}
            ></textarea>
            <button 
              type="submit" 
              className="absolute bottom-0 right-0 w-[54px] h-[48px] flex items-center justify-center"
              disabled={isUploading}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 opacity-75"/>
            </button>
            <p className="text-xs text-gray-500 absolute bottom-0 right-[54px] h-[48px] leading-[48px]">
              {message.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </div>
        </form>

        <input
          type="file"
          ref={fileInput}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,
                  audio/*,
                  video/*,
                  application/*"
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