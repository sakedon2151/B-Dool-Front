"use client"
import React, { Suspense, useEffect } from "react"
import LoadingScreen from "@/app/components/common/LoadingScreen";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useDefaultChannelByWorkspaceId } from "@/app/queries/channel.query";
import { useProfileByMemberIdAndWorkspaceId, useUpdateProfileOnlineStatus } from "@/app/queries/profile.query";
import { getWorkspaceMetadata, removeWorkspaceMetadata, setWorkspaceMetadata } from "@/app/utils/cookieController";
import { useChannelStore } from "@/app/stores/channel.store";
import { useMemberStore } from "@/app/stores/member.store";
import { useProfileStore } from "@/app/stores/profile.store";
import { useWorkspaceStore } from "@/app/stores/workspace.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function DataLoader() {
  const currentMember = useMemberStore(state => state.currentMember); // Zustand Store
  const currentWorkspace = useWorkspaceStore(state => state.currentWorkspace) // Zustand Store
  const setCurrentProfile = useProfileStore(state => state.setCurrentProfile); // Zustand Store
  const setCurrentChannel = useChannelStore(state => state.setCurrentChannel); // Zustand Store

  const { data: profile } = useProfileByMemberIdAndWorkspaceId(currentMember.id, currentWorkspace.id, {
    enabled: !!currentMember.id && !!currentWorkspace.id
  }) // API Suspense Query
  const { data: channel } = useDefaultChannelByWorkspaceId(currentWorkspace.id, {
    enabled: !!currentWorkspace?.id
  }) // API Suspense Query
  const updateProfileOnlineStatus = useUpdateProfileOnlineStatus(); // API Query

  // METADATA Initialize
  useEffect(() => {
    if (!currentWorkspace) return;
    setWorkspaceMetadata(currentWorkspace);
    const metadata = getWorkspaceMetadata();
    document.title = metadata?.title ? `B-DOOL | ${metadata.title}` : 'B-DOOL | 워크스페이스';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content', 
        metadata?.description || '가볍게 사용하는 협업 메신저'
      );
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogTitle) {
      ogTitle.setAttribute(
        'content',
        metadata?.title ? `B-DOOL | ${metadata.title}` : 'B-DOOL | 워크스페이스'
      );
    }
    if (ogDescription) {
      ogDescription.setAttribute(
        'content',
        metadata?.description || '가볍게 사용하는 협업 메신저'
      );
    }
    return () => {
      removeWorkspaceMetadata();
    };
  }, [currentWorkspace]);

  // STORE DATA Initialize
  useEffect(() => {
    if (!profile || !channel) return;
    const prepareMount = async () => {
      try {
        await updateProfileOnlineStatus.mutateAsync({
          profileId: profile.id,
          isOnline: true
        });
        setCurrentProfile({
          ...profile,
          isOnline: true
        })
        setCurrentChannel(channel)
      } catch (error) {
        console.error("워크스페이스 초기화 마운트 오류:", error);
      }
    };
    const prepareUnmount = async () => {
      if (profile) {
        try {
          await updateProfileOnlineStatus.mutateAsync({
            profileId: profile.id,
            isOnline: false
          });
        } catch (error) {
          console.error("워크스페이스 초기화 언마운트 오류:", error);
        }
      }
    };
    prepareMount();
    window.addEventListener('beforeunload', prepareUnmount);
    return () => {
      window.removeEventListener('beforeunload', prepareUnmount);
    };
  }, [currentWorkspace, profile, channel, setCurrentProfile, setCurrentChannel]);
  return null;
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="fixed z-50 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
        <FontAwesomeIcon icon={faCircleExclamation} className="w-6 h-6 opacity-75"/>
        <p className="font-bold text-lg opacity-75">오류가 발생했습니다.</p>
        <p>{error.message}</p>
        <button className="btn" onClick={resetErrorBoundary}>다시 시도</button>
      </div>
    </div>
  )
}

export default function WorkspaceClientLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingScreen/>}>
        <DataLoader/>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}


