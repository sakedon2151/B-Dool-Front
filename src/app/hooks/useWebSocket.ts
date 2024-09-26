import { useState, useEffect, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client, Message } from "@stomp/stompjs";
import { serverBAxios } from "../services/axiosInstance";

interface WebSocketHook {
  messages: MessageModel[];
  sendMessage: (content: string) => void;
  loadMoreMessages: () => void;
}

export const useWebSocket = (channelId: string | undefined): WebSocketHook => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (!channelId) return;
    const socket = new SockJS("/ws/chat");
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("WebSocket에 연결되었습니다.");
        client.subscribe(`/topic/channel/${channelId}`, (message: Message) => {
          const newMessage: MessageModel = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
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
  }, [channelId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!channelId) {
        console.error("채널 ID가 없습니다.")
        return ;
      }
      if (!stompClient) {
        console.error("STOMP 클라이언트가 초기화되지 않았습니다.");
        return;
      }
      if (!stompClient.active) {
        console.error("STOMP 클라이언트가 활성화되지 않았습니다. 재연결을 시도합니다...");
        // 여기에 재연결 로직 추가
        return;
      }
      if (stompClient && stompClient.active) {
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
      }
    },
    [stompClient, channelId]
  );

  const loadMoreMessages = useCallback(() => {
    if (!channelId) return;
    serverBAxios.get<MessageModel[]>(`/messages/${channelId}`, {
      params: {
        page: currentPage,
        size: 10
      }
    })
    .then((response) => {
      const newMessages: MessageModel[] = response.data;
      setMessages((prevMessages) => [
        ...newMessages.reverse(),
        ...prevMessages,
      ]);
      setCurrentPage((prevPage) => prevPage + 1);
    })
    .catch((error) => {
      console.error("Error loading messages:", error);
    });
  }, [channelId, currentPage]);

  useEffect(() => {
    if (channelId) {
      loadMoreMessages();
    }
  }, [channelId, loadMoreMessages]);

  return { messages, sendMessage, loadMoreMessages };
};
