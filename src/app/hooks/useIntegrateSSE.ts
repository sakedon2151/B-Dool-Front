import { useCallback, useEffect, useRef, useState } from "react";
import { useChannelSSE } from "./uesChannelSSE";
import { useProfileSSE } from "./useProfileSSE";
import toast from "react-hot-toast";

interface UseIntegrateSSEProps {
  workspaceId: number;
  profileId?: number;  // profile이 있을 때만 SSE 연결을 위해
  enabled?: boolean;
}

interface ConnectionStates {
  profile: boolean;
  channel: boolean;
}

export const useIntegrateSSE = ({ workspaceId, profileId, enabled = true }: UseIntegrateSSEProps) => {
  const [connectionStates, setConnectionStates] = useState<ConnectionStates>({
    profile: false,
    channel: false
  });

  // 이전 통합 연결 상태를 ref로 관리
  const prevConnectedRef = useRef<boolean | null>(null);
  // 재연결 시도 중인지 추적하는 ref
  const reconnectingRef = useRef<boolean>(false);
  // 마지막 연결 해제 시간을 추적하는 ref
  const lastDisconnectTimeRef = useRef<number | null>(null);
  // 현재 모든 서비스가 연결되었는지 확인
  const isFullyConnected = Object.values(connectionStates).every(state => state);

  // 연결 상태 변경 처리
  const handleConnectionChange = useCallback((service: keyof ConnectionStates, isConnected: boolean) => {
    setConnectionStates(prev => ({
      ...prev,
      [service]: isConnected
    }));

    if (!isConnected) {
      lastDisconnectTimeRef.current = Date.now();
      reconnectingRef.current = true;
    }
  }, []);

  // 에러 처리
  const handleError = useCallback((service: string, error: Error) => {
    console.error(`${service} SSE 연결 오류:`, error);
    if (!reconnectingRef.current) {
      toast.error(`${service} 실시간 연결에 문제가 발생했습니다. 재연결을 시도합니다.`);
    }
  }, []);

  // SSE 훅 사용
  useProfileSSE({
    workspaceId,
    enabled: enabled && !!profileId,
    onError: (error) => handleError('Profile', error),
    onConnectionChange: (isConnected) => handleConnectionChange('profile', isConnected)
  });

  useChannelSSE({
    workspaceId,
    enabled: enabled && !!workspaceId,
    onError: (error) => handleError('Channel', error),
    onConnectionChange: (isConnected) => handleConnectionChange('channel', isConnected)
  });

  /// 통합된 연결 상태 관리
  useEffect(() => {
    if (prevConnectedRef.current === null) {
      prevConnectedRef.current = isFullyConnected;
      return;
    }

    if (prevConnectedRef.current !== isFullyConnected) {
      const now = Date.now();
      // 연결 해제 후 재연결까지 시간이 짧으면 (예: 3초 이내) 토스트를 표시하지 않음
      const isQuickReconnect = lastDisconnectTimeRef.current && 
        (now - lastDisconnectTimeRef.current < 3000);

      
      if (isFullyConnected) {
        reconnectingRef.current = false;
        if (!isQuickReconnect) {
          toast.success('실시간 연결이 복구되었습니다.');
        }
      } else if (!reconnectingRef.current) {
        // 재연결 시도 중이 아닐 때만 연결 해제 메시지 표시
        toast.error('실시간 연결이 끊어졌습니다.');
      }
      prevConnectedRef.current = isFullyConnected;
    }
  }, [isFullyConnected]);

  return {
    states: connectionStates,
    isFullyConnected
  };
};
