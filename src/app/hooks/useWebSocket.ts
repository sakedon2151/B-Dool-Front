import { useState, useEffect, useCallback } from "react";
import { Client, Message } from "@stomp/stompjs";
import { MessageInsertModel, MessageModel } from "../models/message.model";
import { messagePublishService, messageService } from "../services/message/message.service";
import SockJS from "sockjs-client";
import { getToken } from "../utils/cookieController";

interface WebSocketHook {
  messages: MessageModel[];
  sendMessage: (data: MessageInsertModel) => void;
  deleteMessage: (messageId: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  hasMore: boolean;
  isConnected: boolean;
}

export const useWebsocket = (channelId: string, workspaceId: number): WebSocketHook => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState(false);

  const token = getToken();

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
    const socket = new SockJS(process.env.NEXT_PUBLIC_CHAT_SERVER_WEBSOCKET_API as string, null, {
      timeout: 5000, // 연결 타임아웃 설정
      transports: ['websocket', 'xhr-streaming', 'xhr-polling'] // 전송 프로토콜 우선순위 설정
    });

    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { // 인증 헤더 추가
        'Authorization': `Bearer ${token}`,
      },
      onConnect: () => {
        if (!isCurrentConnection) return;
        console.log("websocket 연결 성공");
        setIsConnected(true);

        // 메시지 수신 구독
        client.subscribe(`/topic/channel/${channelId}`, (message: Message) => {
          const newMessage: MessageModel = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // 메시지 삭제 이벤트 구독
        client.subscribe(`/topic/channel/${channelId}/delete`, (message: Message) => {
          const { messageId } = JSON.parse(message.body);
          setMessages((prevMessages) => 
            prevMessages.filter((msg) => msg.messageId !== messageId)
          );
        });

        loadInitialMessages(channelId);
      },

      onDisconnect: () => {
        setIsConnected(false);
      },
      
      onStompError: (frame) => {
        console.error('stomp websocket 연결 오류:', frame.headers['message']);
        setIsConnected(false);
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

  // 메시지 삭제 함수
  const deleteMessage = useCallback(async (messageId: string): Promise<void> => {
    if (!channelId || !stompClient || !messageId) {
      throw new Error("필요한 정보가 없거나 WebSocket이 연결되지 않았습니다.");
    }
    if (!isConnected) {
      throw new Error("서버와 연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.");
    }
    try {
      // const messageToDelete = messages.find(msg => msg.messageId === messageId);
      setMessages(prev => prev.filter(msg => msg.messageId !== messageId));
      await messageService.deleteMessage(messageId);
      stompClient.publish({
        destination: `/pub/channel/${channelId}/delete`,
        body: JSON.stringify({ messageId })
      });
    } catch (error) {
      loadInitialMessages(channelId);
      throw new Error("메시지 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }, [channelId, stompClient, isConnected, messages, loadInitialMessages]);

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
      throw error;
    }
  }, [channelId, currentPage, hasMore]);

  return { messages, sendMessage, deleteMessage, loadMoreMessages, hasMore, isConnected };
};