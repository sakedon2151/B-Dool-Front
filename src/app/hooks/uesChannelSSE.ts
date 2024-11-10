// hooks/useChannelSSE.ts
import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CHANNEL_KEYS } from "@/app/queries/channel.query";
import { ChannelSSEAddModel, ChannelSSERenameModel, ChannelSSEDeleteModel } from "@/app/models/sse.model";

interface UseChannelSSEProps {
  workspaceId: number; // 구독할 워크스페이스 ID
  enabled?: boolean; // SSE 연결 활성화 여부
  onError?: (error: Error) => void; // 에러 발생시 콜백
  onConnectionChange?: (isConnected: boolean) => void; // 연결 상태 변경시 콜백
}

export const useChannelSSE = ({ workspaceId, enabled = true, onError, onConnectionChange }: UseChannelSSEProps) => {
  const queryClient = useQueryClient();

  // SSE 연결 상태 관리를 위한 ref
  const connectionRef = useRef({
    eventSource: null as EventSource | null,
    isActive: false,
  });

  // 채널 추가 이벤트 핸들러
  const handleChannelAdd = useCallback(
    (event: MessageEvent) => {
      try {
        const data: ChannelSSEAddModel = JSON.parse(event.data);

        // 현재 워크스페이스의 이벤트인지 확인
        if (data.workspaceId !== workspaceId) {
          console.warn(`Received channel add event for different workspace: ${data.workspaceId}, current: ${workspaceId}`);
          return;
        }
        // 채널 목록 갱신
        queryClient.invalidateQueries({
          queryKey: CHANNEL_KEYS.byWorkspaceId(workspaceId),
        });
      } catch (error) {
        onError?.(new Error("Failed to parse channel add event"));
      }
    },
    [workspaceId, queryClient, onError]
  );

  // 채널 이름 변경 이벤트 핸들러
  const handleChannelRename = useCallback(
    (event: MessageEvent) => {
      try {
        const data: ChannelSSERenameModel = JSON.parse(event.data);
        
        // 현재 워크스페이스의 이벤트인지 확인
        if (data.workspaceId !== workspaceId) {
          console.warn(`Received channel rename event for different workspace: ${data.workspaceId}, current: ${workspaceId}`);
          return;
        }
        // 채널 목록 및 상세 정보 갱신
        queryClient.invalidateQueries({
          queryKey: CHANNEL_KEYS.byWorkspaceId(workspaceId),
        });
        queryClient.invalidateQueries({
          queryKey: CHANNEL_KEYS.byId(data.channelId),
        });
      } catch (error) {
        onError?.(new Error("Failed to parse channel rename event"));
      }
    },
    [workspaceId, queryClient, onError]
  );

  // 채널 삭제 이벤트 핸들러
  const handleChannelDelete = useCallback(
    (event: MessageEvent) => {
      try {
        const data: ChannelSSEDeleteModel = JSON.parse(event.data);
        
        // 현재 워크스페이스의 이벤트인지 확인
        if (data.workspaceId !== workspaceId) {
          console.warn(`Received channel delete event for different workspace: ${data.workspaceId}, current: ${workspaceId}`);
          return;
        }

        // 채널 목록 갱신
        queryClient.invalidateQueries({
          queryKey: CHANNEL_KEYS.byWorkspaceId(workspaceId),
        });
      } catch (error) {
        onError?.(new Error("Failed to parse channel delete event"));
      }
    },
    [workspaceId, queryClient, onError]
  );

  // SSE 연결 함수
  const connectSSE = useCallback(() => {
    const conn = connectionRef.current;
    // 이미 연결된 상태면 중복 연결 방지
    if (conn.isActive) {
      console.warn("Connection already active");
      return null;
    }
    const sseEndpoint = process.env.NEXT_PUBLIC_CHAT_SERVER_SSE_API as string;
    if (!sseEndpoint) {
      onError?.(new Error("SSE endpoint not defined"));
      return null;
    }
    console.log(`Initializing SSE connection for workspace ${workspaceId}`);
    // 새로운 SSE 연결 생성
    const newEventSource = new EventSource(`${sseEndpoint}/subscribe`, {
      withCredentials: true,
    });
    // 연결 성공시
    newEventSource.onopen = () => {
      console.log(`SSE connection established for workspace ${workspaceId}`);
      conn.isActive = true;
      onConnectionChange?.(true);
    };
    // 연결 에러 또는 서버 타임아웃시 (30초)
    newEventSource.onerror = () => {
      conn.isActive = false;
      onConnectionChange?.(false);
      // 기존 연결 정리
      newEventSource.close();
      conn.eventSource = null;
      // 1초 후 재연결 시도
      setTimeout(() => {
        if (workspaceId && enabled) {
          connectSSE();
        }
      }, 1000);
    };

    // 이벤트 리스너 등록
    newEventSource.addEventListener("channel-add", handleChannelAdd);
    newEventSource.addEventListener("channel-rename", handleChannelRename);
    newEventSource.addEventListener("channel-delete", handleChannelDelete);

    conn.eventSource = newEventSource;
    return newEventSource;
  }, [workspaceId, enabled, onError, onConnectionChange, handleChannelAdd, handleChannelRename, handleChannelDelete]);

  // 워크스페이스 변경 또는 컴포넌트 마운트시 SSE 연결
  useEffect(() => {
    if (workspaceId && enabled) {
      connectSSE();
    }
    // 클린업: 워크스페이스 변경 또는 컴포넌트 언마운트시
    return () => {
      const conn = connectionRef.current;
      if (conn.eventSource) {
        console.log(`Closing SSE connection for workspace ${workspaceId}`);
        conn.isActive = false;
        conn.eventSource.removeEventListener("channel-add", handleChannelAdd);
        conn.eventSource.removeEventListener("channel-rename", handleChannelRename);
        conn.eventSource.removeEventListener("channel-delete", handleChannelDelete);
        conn.eventSource.close();
        conn.eventSource = null;
      }
    };
  }, [workspaceId, enabled, connectSSE, handleChannelAdd, handleChannelRename, handleChannelDelete]);
};