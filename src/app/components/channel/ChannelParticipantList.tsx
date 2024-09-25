import { useEffect, useState } from "react";
import ParticipantModal from "./ParticipantModal";
import { profileService } from "@/app/services/profile/profile.api";

interface ChannelParticipantListProps {
  workspaceId: number;
}

export default function ChannelParticipantList({ workspaceId }: ChannelParticipantListProps) {
  const [profiles, setProfiles] = useState<ProfileModel[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedProfile, setSelectedProfile] = useState<ProfileModel | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 'auto', bottom: 'auto' });

  const onlineProfiles = profiles.filter(profile => profile.isOnline);
  const offlineProfiles = profiles.filter(profile => !profile.isOnline);

  const handleProfileClick = (profile: ProfileModel, event: React.MouseEvent) => {
    const liElement = (event.target as HTMLElement).closest('li');
    if (liElement) {
      const rect = liElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const modalHeight = 220; // 임의 지정
      if (rect.bottom + modalHeight > windowHeight) {
        setModalPosition({ 
          top: 'auto',
          bottom: `${windowHeight - rect.bottom}px`
        });
      } else {
        setModalPosition({ 
          top: `${rect.top}px`,
          bottom: 'auto'
        });
      }
    }
    setSelectedProfile(profile);
    document.getElementById('participant-modal')?.showModal();
  };

  useEffect(() => {
    fetchProfiles(workspaceId)
    connectSSE()
  }, [])  

  const fetchProfiles = async (workspaceId: number) => {
    try {
      const response = await profileService.getAllProfileByWorkspaceId({ workspaceId })
      if (Array.isArray(response)) {
        setProfiles(response)
      } else {
        console.error('Unexpected response format:', response);
        setError('채널 데이터 형식이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('error', error);
      setError('프로필 목록을 불러오는데 실패했습니다. 나중에 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  };

  const connectSSE = () => {
    const eventSource = new EventSource(`http://211.188.50.55:8080/api/sse/subscribe`);
    eventSource.addEventListener('nickname-change', (event: MessageEvent) => {
      const updatedProfile: ProfileModel = JSON.parse(event.data);
      setProfiles(prevProfiles => 
        prevProfiles.map(profile =>
          profile.id === updatedProfile.id
            ? { ...profile, nickname: updatedProfile.nickname }
            : profile
        )
      );
    });

    eventSource.addEventListener('online-status-change', (event: MessageEvent) => {
      const updatedProfile: ProfileModel = JSON.parse(event.data);
      setProfiles(prevProfiles => 
        prevProfiles.map(profile =>
          profile.id === updatedProfile.id
            ? { ...profile, isOnline: updatedProfile.isOnline }
            : profile
        )
      );
    });

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
      setTimeout(connectSSE, 5000);  // 5초 후 재연결 시도
    };

    return () => {
      eventSource.close();
    };
  };

  return (
    <>
      <ul className="menu">
        <li className="menu-title">온라인 - {onlineProfiles.length}</li>
        {onlineProfiles.map((profile) => (
          <li key={profile.id} onClick={(e) => handleProfileClick(profile, e)}>
            <a>
              <div className="avatar online placeholder">
                <div className="bg-neutral text-neutral-content w-8 rounded-full">
                  <span className="text-xs">U</span>
                </div>
              </div>
              <p className="truncate whitespace-nowrap overflow-hidden">{profile.nickname}</p>
            </a>
          </li>
        ))}
      </ul>

      <ul className="menu">
        <li className="menu-title">오프라인 - {offlineProfiles.length}</li>
        {offlineProfiles.map((profile) => (
          <li key={profile.id} onClick={(e) => handleProfileClick(profile, e)}>
            <a>
              <div className="avatar offline placeholder">
                <div className="bg-neutral text-neutral-content w-8 rounded-full">
                  <span className="text-xs">U</span>
                </div>
              </div>
              <p className="truncate whitespace-nowrap overflow-hidden">{profile.nickname}</p>
            </a>
          </li>
        ))}
      </ul>

      <dialog id="participant-modal" className="modal modal-bottom lg:modal-middle">
        <div className="modal-box lg:fixed lg:right-64 lg:p-4" style={{
          top: modalPosition.top,
          bottom: modalPosition.bottom
        }}>
          <ParticipantModal selectedProfile={selectedProfile}/>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
