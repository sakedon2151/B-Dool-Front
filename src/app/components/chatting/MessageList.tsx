import React, { useCallback, useEffect, useRef, useState } from "react";
import ChannelMessage from "./MessageBubble";
import { useWebsocket } from "@/app/hooks/useWebsocket";
import { toDayDividerTime } from "@/app/utils/formatDateTime";
import { debounce } from "lodash";
import { useChannelStore } from "@/app/stores/channel.store";
import toast from "react-hot-toast";

interface MessageListProps {
  workspaceId: number;
}

export default function MessageList({ workspaceId }: MessageListProps) {
  const currentChannel = useChannelStore((state) => state.currentChannel); // Zustand Store
  const { messages, loadMoreMessages, hasMore, isConnected, deleteMessage } = useWebsocket(currentChannel.channelId, workspaceId); // Stomp Websocket Hook
  
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const prevMessagesLengthRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const isNearBottomRef = useRef(true);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, []);

  const checkIfNearBottom = useCallback(() => {
    if (messageAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageAreaRef.current;
      isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
    }
  }, []);

  const debouncedCheckIfNearBottom = useCallback(
    debounce(checkIfNearBottom, 100),
    [checkIfNearBottom]
  );

  useEffect(() => {
    if (isInitialLoadRef.current && messages.length > 0) {
      scrollToBottom();
      isInitialLoadRef.current = false;
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (
      messages.length > prevMessagesLengthRef.current &&
      !isInitialLoadRef.current
    ) {
      if (isNearBottomRef.current) {
        scrollToBottom();
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, scrollToBottom]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setIsLoading(true);
      const oldScrollHeight = messageAreaRef.current?.scrollHeight ?? 0;
      loadMoreMessages()
        .then(() => {
          requestAnimationFrame(() => {
            if (messageAreaRef.current) {
              const newScrollHeight = messageAreaRef.current.scrollHeight;
              messageAreaRef.current.scrollTop =
                newScrollHeight - oldScrollHeight;
            }
          });
        })
        .catch((error) => {
          console.error("Failed to load more messages:", error);
          setError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isLoading, hasMore, loadMoreMessages]);

  const handleScroll = useCallback(() => {
    const messageArea = messageAreaRef.current;
    if (messageArea && !isLoading) {
      if (messageArea.scrollTop === 0) {
        handleLoadMore();
      }
      debouncedCheckIfNearBottom();
    }
  }, [handleLoadMore, isLoading, debouncedCheckIfNearBottom]);

  const handleMessageDeleted = useCallback(async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      toast.success('메시지가 삭제되었습니다.');
    } catch (error) {
      toast.error('메시지 삭제에 실패했습니다.');
    }
  }, [deleteMessage]);

  useEffect(() => {
    const messageArea = messageAreaRef.current;
    if (messageArea) {
      messageArea.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (messageArea) {
        messageArea.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);
  
  let currentDate = "";
  
  return (
    <div className="h-full p-4 overflow-y-auto" ref={messageAreaRef}>
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="loading loading-spinner"></span>
          <div className="text-sm text-gray-500">메시지 불러오는 중...</div>
        </div>
      )}
      
      {error && (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-error">{error}</span>
          <button 
            className="btn btn-error"
            onClick={() => {
              setError(null);
              handleLoadMore();
            }}
          >
            다시 시도
          </button>
        </div>
      )}

      {!isConnected && (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="loading loading-spinner"></span>
          <p className="text-lg">연결이 끊겼습니다.</p>
          <p className="text-sm text-gray-500">재연결 중...</p>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-lg">아직 대화가 없습니다</p>
          <p className="text-sm text-gray-500">첫 메시지를 보내 대화를 시작해보세요!</p>
        </div>
      ) : (
        messages.map((message, index) => {
          const messageDivider = toDayDividerTime(message.sendDate);
          let divider = null;
          if (messageDivider !== currentDate) {
            currentDate = messageDivider;
            divider = (
              <div key={`date-${messageDivider}`} className="text-xs opacity-50 divider">
                {messageDivider}
              </div>
            );
          }
          return (
            <div key={message.messageId} ref={index === messages.length - 1 ? lastMessageRef : null}>
              {divider}
              <ChannelMessage 
                selectedMessage={message}
                onMessageDeleted={() => handleMessageDeleted(message.messageId)}  
              />
            </div>
          );
        })
      )}
    </div>
  );
}
