import React, { useCallback, useEffect, useRef, useState } from "react";
import ChannelMessage from "./ChannelMessage";
import { useWebSocket } from "@/app/hooks/useWebSocket";
import { useChannelStore } from "@/app/stores/channelStores";
import { debounce } from 'lodash';  // lodash의 debounce 함수를 사용합니다. 필요시 설치해주세요.

export default function ChannelMessageList() {
  const selectedChannel = useChannelStore((state) => state.selectedChannel);
  const { messages, loadMoreMessages, hasMore } = useWebSocket(selectedChannel.channelId);
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);
  const isInitialLoadRef = useRef(true);
  const isNearBottomRef = useRef(true);

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
    if (messages.length > prevMessagesLengthRef.current && !isInitialLoadRef.current) {
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
              messageAreaRef.current.scrollTop = newScrollHeight - oldScrollHeight;
            }
          });
        })
        .catch((error) => {
          console.error("Failed to load more messages:", error);
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

  useEffect(() => {
    const messageArea = messageAreaRef.current;
    if (messageArea) {
      messageArea.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (messageArea) {
        messageArea.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  let currentDate = "";

  return (
    <div className="h-full p-4 overflow-y-auto" ref={messageAreaRef}>
      {isLoading && (
        <div className="text-center">Loading more messages...</div>
      )}
      {messages.map((message, index) => {
        const messageDate = message.sendDate;
        let divider = null;
        if (messageDate !== currentDate) {
          currentDate = messageDate;
          divider = (
            <div key={`date-${messageDate}`} className="text-xs opacity-50 divider">
              {messageDate}
            </div>
          );
        }
        return (
          <div 
            key={message.messageId} 
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            {divider}
            <ChannelMessage selectedMessage={message} />
          </div>
        );
      })}
    </div>
  );
}