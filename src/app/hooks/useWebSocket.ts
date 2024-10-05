import { useState, useEffect, useCallback } from "react";
import { Client, Message } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { MessageModel } from "../models/message.model";
import { messageService } from "../services/message/message.service";

interface WebSocketHook {
  messages: MessageModel[];
  sendMessage: (content: string) => void;
  loadMoreMessages: () => Promise<void>;
  hasMore: boolean;
}

export const useWebsocket = (channelId: string): WebSocketHook => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // 메세지 및 페이지네이션 초기화 함수
  const resetState = useCallback(() => {
    setMessages([]);
    setCurrentPage(0);
    setHasMore(true);
  }, []);
  
  // 초기 메시지 요청 함수
  const loadInitialMessages = useCallback((channelId: string) => {
    messageService.getMessageList(channelId, 0, 10)
    .then((response) => {
      const newMessages: MessageModel[] = response.data;
      setMessages(newMessages.reverse());
      setCurrentPage(1);
      setHasMore(newMessages.length === 10);
    })
    .catch((error) => {
      console.error("Error loading initial messages:", error);
    });
  }, []);

  // 컴포넌트 마운트시 초기 실행 - websocket 연결
  useEffect(() => {
    if (!channelId) return;
    resetState();
    const socket = new SockJS(process.env.NEXT_PUBLIC_SERVER_B_WEBSOCKET_URL as string);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("WebSocket에 연결되었습니다.");
        client.subscribe(`/topic/channel/${channelId}`, (message: Message) => {
          const newMessage: MessageModel = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        loadInitialMessages(channelId);
      },
      onStompError: (frame) => {
        console.error('STOMP 에러:', frame.headers['message']);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    client.activate();
    setStompClient(client);
    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [channelId, resetState, loadInitialMessages]);
  
  // 메시지 전송 함수
  const sendMessage = useCallback(
    (content: string) => {
      if (!channelId || !stompClient || !stompClient.active) {
        console.error("메시지를 보낼 수 없습니다. 연결 상태를 확인해주세요.")
        return ;
      }
      try {
        stompClient.publish({
          destination: `/app/message/${channelId}`,
          body: JSON.stringify({
            content,
            channelId,
            profileId: "a6cbe7e9-203b-4f9c-beb6-efeb8ce7a84b", // 실제 사용시 현재 로그인한 사용자 ID로 대체
          }),
        });
      } catch (error) {
        console.error("메시지 전송 실패:", error);
      }
    },
    [stompClient, channelId]
  );

  // 메시지 추가 요청 함수
  const loadMoreMessages = useCallback((): Promise<void> => {
    if (!channelId || !hasMore) return Promise.resolve();
    return messageService.getMessageList(channelId, currentPage, 10)
      .then((response) => {
        const newMessages: MessageModel[] = response.data;
        if (newMessages.length > 0) {
          setMessages((prevMessages) => {
            const uniqueNewMessages = newMessages.filter(
              (newMsg) => !prevMessages.some((prevMsg) => prevMsg.messageId === newMsg.messageId)
            );
            return [...uniqueNewMessages.reverse(), ...prevMessages];
          });
          setCurrentPage((prevPage) => prevPage + 1);
          setHasMore(newMessages.length === 10);
        } else {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
        return Promise.reject(error);
      });
  }, [channelId, currentPage, hasMore]);

  return { messages, sendMessage, loadMoreMessages, hasMore };
};