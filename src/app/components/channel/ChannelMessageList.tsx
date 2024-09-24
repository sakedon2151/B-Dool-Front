import dummyMessages from "@/app/tests/dummyMessages";
import { useEffect, useState } from "react";
import ChannelMessage from "./ChannelMessage";
import { formatDateToDividerDay } from "@/app/utils/formatDate";
import React from "react";

export default function ChannelMessageList() {
  const [messages, setMessages] = useState<MessageModel[]>([]);

  let currentDate = "";

  useEffect(() => {
    setMessages(dummyMessages);
  }, []);

  return (
    <div className="p-4">
      {messages.map((message) => {
        const messageDate = formatDateToDividerDay(message.createdAt);
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
          <React.Fragment key={`message-group-${message.id}`}>
            {divider}
            <ChannelMessage assignedMessage={message} />
          </React.Fragment>
        );
      })}
    </div>
  );
}
