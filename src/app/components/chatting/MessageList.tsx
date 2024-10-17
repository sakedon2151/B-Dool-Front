import React, { useCallback, useEffect, useRef, useState } from "react";
import ChannelMessage from "./MessageBubble";
import { useWebsocket } from "@/app/hooks/useWebsocket";
import { toDayDividerTime } from "@/app/utils/formatDateTime";
import { debounce } from 'lodash';
import { useChannelStore } from "@/app/stores/channel.store";

export default function MessageList() {
  const currentChannel = useChannelStore(state => state.currentChannel);  // Zustand Store
  const { messages, loadMoreMessages, hasMore } = useWebsocket(currentChannel.channelId); // Stomp Websocket Hook
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
        <div className="text-center">메시지 불러오는 중...</div>
      )}
      {error && (
        <div className="text-center text-red-500">{error}</div>
      )}
      {messages.map((message, index) => {
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
            <ChannelMessage selectedMessage={message} />
          </div>
        );
      })}
    </div>
  );
}