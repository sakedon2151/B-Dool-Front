import { useEffect, useRef, useState } from "react";
import ChannelMessage from "./ChannelMessage";
import React from "react";
import { useWebSocket } from "@/app/hooks/useWebSocket";
import { useChannelStore } from "@/app/stores/channelStores";

export default function ChannelMessageList() {
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const { messages, loadMoreMessages } = useWebSocket(selectedChannel?.channelId);
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const [prevChannelId, setPrevChannelId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const messageArea = messageAreaRef.current;
    if (messageArea) {
      messageArea.scrollTop = messageArea.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedChannel?.channelId !== prevChannelId) {
      setPrevChannelId(selectedChannel?.channelId);
    }
  }, [selectedChannel?.channelId, prevChannelId]);

  const handleScroll = () => {
    const messageArea = messageAreaRef.current;
    if (messageArea && messageArea.scrollTop === 0) {
      loadMoreMessages();
    }
  };

  let currentDate = "";

  return (
    <div className="p-4" ref={messageAreaRef} onScroll={handleScroll}>
      {messages.map((message) => {
        const messageDate = message.createdAt;
        let divider = null;
        if (messageDate !== currentDate) {
          currentDate = messageDate;
          divider = (
            <div key={`date-${messageDate}`} className="divider text-xs opacity-50">
              {messageDate}
            </div>
          );
        }
        return (
          <React.Fragment key={message.messageId}>
            {divider}
            <ChannelMessage assignedMessage={message} />
          </React.Fragment>
        );
      })}
    </div>
  );
}
