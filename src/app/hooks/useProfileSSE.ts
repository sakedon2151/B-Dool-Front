import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PROFILE_KEYS } from "@/app/queries/profile.query";
import { ProfileSSENicknameModel, ProfileSSEOnlineModel } from "../models/sse.model";


interface UseProfileSSEProps {
  workspaceId: number; // 구독할 워크스페이스 ID
  enabled?: boolean; // SSE 연결 활성화 여부
  onError?: (error: Error) => void; // 에러 발생시 콜백
  onConnectionChange?: (isConnected: boolean) => void; // 연결 상태 변경시 콜백
}

export const useProfileSSE = ({ workspaceId, enabled = true, onError, onConnectionChange }: UseProfileSSEProps) => {
  const queryClient = useQueryClient();

  // SSE 연결 상태 관리를 위한 ref
  const connectionRef = useRef({
    eventSource: null as EventSource | null, // SSE 연결 객체
    isActive: false, // 현재 연결 상태
  });

  // 닉네임 변경 이벤트 핸들러
  const handleNicknameChange = useCallback(
    (event: MessageEvent) => {
      try {
        const data: ProfileSSENicknameModel = JSON.parse(event.data);
        
        // 현재 워크스페이스의 이벤트인지 확인
        if (data.workspaceId !== workspaceId) {
          console.warn(`Received nickname change event for different workspace: ${data.workspaceId}, current: ${workspaceId}`);
          return;
        }
        // 프로필 및 워크스페이스 데이터 갱신
        queryClient.invalidateQueries({
          queryKey: PROFILE_KEYS.byId(data.id),
        });
        queryClient.invalidateQueries({
          queryKey: PROFILE_KEYS.byWorkspaceId(workspaceId),
        });
      } catch (error) {
        onError?.(new Error("Failed to parse nickname change event"));
      }
    },
    [workspaceId, queryClient, onError]
  );

  // 온라인 상태 변경 이벤트 핸들러
  const handleOnlineStatusChange = useCallback(
    (event: MessageEvent) => {
      try {
        const data: ProfileSSEOnlineModel = JSON.parse(event.data);
        
        // 현재 워크스페이스의 이벤트인지 확인
        if (data.workspaceId !== workspaceId) {
          console.warn(`Received online status event for different workspace: ${data.workspaceId}, current: ${workspaceId}`);
          return;
        }
        // 프로필 및 워크스페이스 데이터 갱신
        queryClient.invalidateQueries({
          queryKey: PROFILE_KEYS.byId(data.id),
        });
        queryClient.invalidateQueries({
          queryKey: PROFILE_KEYS.byWorkspaceId(workspaceId),
        });
      } catch (error) {
        onError?.(new Error("Failed to parse online status change event"));
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
    const sseEndpoint = process.env.NEXT_PUBLIC_MEMBER_SERVER_PROFILE_SSE_API as string;
    if (!sseEndpoint) {
      onError?.(new Error("SSE endpoint not defined"));
      return null;
    }
    // console.log(`Initializing SSE connection for workspace ${workspaceId}`);
    // 새로운 SSE 연결 생성
    const newEventSource = new EventSource(`${sseEndpoint}/subscribe`, {
      withCredentials: true,
    });
    // 연결 성공시
    newEventSource.onopen = () => {
      // console.log(`SSE connection established for workspace ${workspaceId}`);
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
    newEventSource.addEventListener("nickname-change", handleNicknameChange);
    newEventSource.addEventListener("online-status-change", handleOnlineStatusChange);

    conn.eventSource = newEventSource;
    return newEventSource;
  }, [workspaceId, enabled, onError, onConnectionChange, handleNicknameChange, handleOnlineStatusChange,]);

  // 워크스페이스 변경 또는 컴포넌트 마운트시 SSE 연결
  useEffect(() => {
    if (workspaceId && enabled) {
      connectSSE();
    }
    // 클린업: 워크스페이스 변경 또는 컴포넌트 언마운트시
    return () => {
      const conn = connectionRef.current;
      if (conn.eventSource) {
        // console.log(`Closing SSE connection for workspace ${workspaceId}`);
        conn.isActive = false;
        conn.eventSource.removeEventListener("nickname-change", handleNicknameChange);
        conn.eventSource.removeEventListener("online-status-change", handleOnlineStatusChange);
        conn.eventSource.close();
        conn.eventSource = null;
      }
    };
  }, [workspaceId, enabled, connectSSE, handleNicknameChange, handleOnlineStatusChange,]);
};
