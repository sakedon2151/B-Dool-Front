import { useState, useEffect, useCallback } from "react";
import { Client, Message } from "@stomp/stompjs";
import { MessageInsertModel, MessageModel } from "../models/message.model";
import { messagePublishService, messageService } from "../services/message/message.service";
import SockJS from "sockjs-client";

interface WebSocketHook {
  messages: MessageModel[];
  sendMessage: (data: MessageInsertModel) => void;
  loadMoreMessages: () => Promise<void>;
  hasMore: boolean;
}

export const useWebsocket = (channelId: string, workspaceId: number): WebSocketHook => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const resetState = useCallback(() => {
    setMessages([]);
    setCurrentPage(0);
    setHasMore(true);
  }, []);
  
  // 초기 메시지 요청 함수
  const loadInitialMessages = useCallback((channelId: string) => {
    messageService.getMessageList(channelId, 0, 10)
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setMessages(data.reverse());
        setCurrentPage(1);
        setHasMore(data.length === 10);
      } else {
        setMessages([]);
        setCurrentPage(0);
        setHasMore(false);
      }
    })
    .catch((error) => {
      console.error("초기 메시지 로드 오류:", error);
      setMessages([]);
      setCurrentPage(0);
      setHasMore(false);
    });
  }, [resetState]);

  // 컴포넌트 마운트시 초기 실행 - websocket 연결
  useEffect(() => {
    if (!channelId) return;
    let isCurrentConnection = true;
    resetState();
    const socket = new SockJS(process.env.NEXT_PUBLIC_SERVER_B_WEBSOCKET_URL as string);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        if (!isCurrentConnection) return;
        console.log("websocket 에 연결되었습니다.");
        client.subscribe(`/topic/channel/${channelId}`, (message: Message) => {
          const newMessage: MessageModel = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        loadInitialMessages(channelId);
      },
      onStompError: (frame) => {
        console.error('stomp websocket 연결 오류:', frame.headers['message']);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    client.activate();
    setStompClient(client);

    return () => {
      isCurrentConnection = false;
      if (client.active) {
        client.deactivate();
      }
    };
  }, [workspaceId, channelId, resetState, loadInitialMessages]);
  
  // 메시지 전송 함수
  const sendMessage = useCallback(async (data: MessageInsertModel): Promise<void> => {
    if (!channelId || !stompClient) {
      console.error("채널 ID가 없거나 WebSocket이 연결되지 않았습니다.");
      return;
    }
    try {
      await messagePublishService(stompClient).sendMessage(channelId, data);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      throw error;
    }
  }, [channelId, stompClient]);

  // 메시지 추가 요청 함수
  const loadMoreMessages = useCallback(async (): Promise<void> => {
    if (!channelId || !hasMore) return;
    try {
      const newMessages: MessageModel[] = await messageService.getMessageList(channelId, currentPage, 10);
      if (newMessages.length > 0) {
        setMessages(prevMessages => {
          const uniqueNewMessages = newMessages.filter(
            (newMsg) => !prevMessages.some((prevMsg) => prevMsg.messageId === newMsg.messageId)
          );
          return [...uniqueNewMessages.reverse(), ...prevMessages];
        });
        setCurrentPage(prevPage => prevPage + 1);
        setHasMore(newMessages.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("메시지 로드 오류:", error);
    }
  }, [channelId, currentPage, hasMore]);

  return { messages, sendMessage, loadMoreMessages, hasMore };
};