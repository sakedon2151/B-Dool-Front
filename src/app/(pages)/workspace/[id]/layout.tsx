"use client"
import React, { Suspense, useEffect, useState } from "react"
import LoadingScreen from "@/app/components/common/LoadingScreen";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useDefaultChannelByWorkspaceId } from "@/app/queries/channel.query";
import { useProfileByMemberIdAndWorkspaceId, useUpdateProfileOnlineStatus } from "@/app/queries/profile.query";
import { getToken, getWorkspaceMetadata, removeWorkspaceMetadata, setWorkspaceMetadata } from "@/app/utils/cookieController";
import { useChannelStore } from "@/app/stores/channel.store";
import { useMemberStore } from "@/app/stores/member.store";
import { useProfileStore } from "@/app/stores/profile.store";
import { useWorkspaceStore } from "@/app/stores/workspace.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function LoadingWithTimeout() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.location.reload();
    }, 5000); // 5초 경과 시 새로고침
    return () => clearTimeout(timeoutId);
  }, []);
  return <LoadingScreen />;
}

function DataLoader() {
  const currentMember = useMemberStore(state => state.currentMember); // Zustand Store
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace) // Zustand Store
  const setCurrentProfile = useProfileStore(state => state.setCurrentProfile); // Zustand Store
  const setCurrentChannel = useChannelStore(state => state.setCurrentChannel); // Zustand Store

  const { data: profile } = useProfileByMemberIdAndWorkspaceId(currentMember.id, currentWorkspace.id, {
    enabled: !!currentMember.id && !!currentWorkspace.id,
    suspense: true
  }) // API Suspense Query
  const { data: channel } = useDefaultChannelByWorkspaceId(currentWorkspace.id, {
    enabled: !!currentWorkspace?.id,
    suspense: true
  }) // API Suspense Query
  const updateProfileOnlineStatus = useUpdateProfileOnlineStatus(); // API Query

  // METADATA Initialize
  useEffect(() => {
    if (!currentWorkspace) return;
    const updateMetadata = () => {
      try {
        setWorkspaceMetadata(currentWorkspace);
        const metadata = getWorkspaceMetadata();
        const title = metadata?.title ? `B-DOOL | ${metadata.title}` : 'B-DOOL | 워크스페이스';
        const description = metadata?.description || '가볍게 사용하는 협업 메신저';
        document.title = title;
        const metaTags = {
          'description': description,
          'og:title': title,
          'og:description': description
        };
        Object.entries(metaTags).forEach(([key, value]) => {
          const selector = key.startsWith('og:') 
            ? `meta[property="${key}"]`
            : `meta[name="${key}"]`;
          const element = document.querySelector(selector);
          if (element) {
            element.setAttribute('content', value);
          }
        });
      } catch (error) {
        console.error('메타데이터 업데이트 오류:', error);
      }
    }
    updateMetadata();
    
    return () => {
      removeWorkspaceMetadata();
    };
  }, [currentWorkspace]);

  // STORE DATA Initialize
  useEffect(() => {
    if (!profile || !channel) return;
    let isSubscribed = true; // cleanup 플래그
    const prepareMount = async () => {
      try {
        await updateProfileOnlineStatus.mutateAsync({
          profileId: profile.id,
          isOnline: true
        });
        if (isSubscribed) {
          setCurrentProfile({
            ...profile,
            isOnline: true
          });
          setCurrentChannel(channel);
        }
      } catch (error) {
        console.error("워크스페이스 초기화 마운트 오류:", error);
        throw new Error("워크스페이스 초기화에 실패했습니다.");
      }
    };
    const prepareUnmount = async () => {
      if (!profile) return;
      try {
        await updateProfileOnlineStatus.mutateAsync({
          profileId: profile.id,
          isOnline: false
        });
      } catch (error) {
        console.error("워크스페이스 초기화 언마운트 오류:", error);
      }
    };
    prepareMount();
    window.addEventListener('beforeunload', prepareUnmount);
    return () => {
      isSubscribed = false;
      window.removeEventListener('beforeunload', prepareUnmount);
      prepareUnmount();
    };
  }, [currentWorkspace, profile, channel, setCurrentProfile, setCurrentChannel]);
  return null;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    console.error('Critical workspace error:', error);
  }, [error]);
  
  return (
    <div className="fixed z-50 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
        <FontAwesomeIcon 
          icon={faCircleExclamation} 
          className="w-6 h-6 opacity-75"
        />
        <p className="font-bold text-lg opacity-75">오류가 발생했습니다.</p>
        <p>{error.message}</p>
        <button 
          className="btn"
          onClick={() => {
            try {
              resetErrorBoundary();
            } catch (e) {
              window.location.href = '/auth';
            }
          }}
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}

export default function WorkspaceClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = '/auth';
      return;
    }
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <LoadingWithTimeout />;
  }
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingWithTimeout/>}>
        <DataLoader/>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}