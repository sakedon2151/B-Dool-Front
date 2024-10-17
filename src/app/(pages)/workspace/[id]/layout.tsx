"use client"
import { useDefaultChannelByWorkspaceId } from "@/app/queries/channel.query";
import { useProfileByMemberIdAndWorkspaceId, useUpdateProfileOnlineStatus } from "@/app/queries/profile.query";
import { useChannelStore } from "@/app/stores/channel.store";
import { useMemberStore } from "@/app/stores/member.store";
import { useProfileStore } from "@/app/stores/profile.store";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect } from "react"

function DataLoader() {
  const params = useParams();
  const workspaceId = parseInt(params.id as string, 10)
  
  if (isNaN(workspaceId)) {
    throw new Error("Invalid workspace ID");
  }

  const currentMember = useMemberStore(state => state.currentMember); // Zustand Store
  const setCurrentProfile = useProfileStore(state => state.setCurrentProfile); // Zustand Store
  const setCurrentChannel = useChannelStore(state => state.setCurrentChannel); // Zustand Store

  const { data: profile } = useProfileByMemberIdAndWorkspaceId(currentMember.id, workspaceId) // API Suspense Query
  const { data: channel } = useDefaultChannelByWorkspaceId(workspaceId) // API Suspense Query
  const updateProfileOnlineStatus = useUpdateProfileOnlineStatus(); // API Query

  useEffect(() => {
    if (!profile || !channel) return; // 데이터가 없으면 실행하지 않음

    const prepareMount = async () => {
      if (profile) {
        const initializeThisSession = sessionStorage.getItem('initialize');
        if (!initializeThisSession) {
          try {
            await updateProfileOnlineStatus.mutateAsync({
              profileId: profile.id,
              isOnline: true
            });
            setCurrentProfile({
              ...profile,
              isOnline: true
            });
            if (channel) setCurrentChannel(channel);
            sessionStorage.setItem('initialize', 'true');
          } catch (error) {
            console.error("워크스페이스 초기화 마운트 오류: ", error);
          }
        }
      }
    };
    prepareMount();

    const prepareUnmount = async () => {
      if (profile) {
        try {
          await updateProfileOnlineStatus.mutateAsync({
            profileId: profile.id,
            isOnline: false
          });
        } catch (error) {
          console.error("워크스페이스 초기화 언마운트 오류: ", error);
        }
      }
    };
    window.addEventListener('beforeunload', prepareUnmount);
    
    return () => {
      window.removeEventListener('beforeunload', prepareUnmount);
    };
  }, [workspaceId, profile, channel, updateProfileOnlineStatus, setCurrentProfile, setCurrentChannel]);
  return null;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <h2>오류가 발생했습니다:</h2>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>다시 시도</button>
      </div>
    </div>
  )
}

export default function WorkspaceLayout({children}: {children: React.ReactNode}) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">로딩 중...</div>}>
        <DataLoader/>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
