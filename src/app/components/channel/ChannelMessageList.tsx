import { useEffect, useRef } from "react";
import ChannelMessage from "./ChannelMessage";
import React from "react";
import { useWebSocket } from "@/app/hooks/useWebSocket";
import { useChannelStore } from "@/app/stores/channelStores";

export default function ChannelMessageList() {
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const { messages, loadMoreMessages } = useWebSocket(selectedChannel?.channelId);
  const messageAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messageArea = messageAreaRef.current;
    if (messageArea) {
      messageArea.scrollTop = messageArea.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    const messageArea = messageAreaRef.current;
    if (messageArea && messageArea.scrollTop === 0) {
      loadMoreMessages();
    }
  };

  let currentDate = "";

  return (
    <div className="p-4" onScroll={handleScroll}>
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
