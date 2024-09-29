import { useState, useEffect } from 'react';
import { MessageModel } from '../models/message.model';
import { messageService } from '../services/message/message.api';

export const useWebsocket = (channelId: string) => {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const msInstance = new messageService('ws://your-websocket-url');

  useEffect(() => {
    msInstance.connect();
    msInstance.subscribeToChannel(channelId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });
    return () => msInstance.disconnect();
  }, [channelId]);

  const sendMessage = (content: string, profileId: string) => {
    msInstance.sendMessage(channelId, content, profileId);
  };

  const loadMessages = async (page: number, size: number) => {
    const response = await msInstance.getMessagesByChannelId(channelId, page, size);
    setMessages(prev => [...response.data, ...prev]);
  };

  return { messages, sendMessage, loadMessages };
};