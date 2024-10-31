import { useState } from "react";
import ParticipantModal from "./ParticipantModal";
import { useChannelStore } from "@/app/stores/channel.store";
import { useParticipantsByChannelId } from "@/app/queries/participant.query";
import { ParticipantModel } from "@/app/models/participant.model";

interface ParticipantListProps {
  workspaceId: number;
}

export default function ParticipantList() {
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantModel | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 'auto', bottom: 'auto' });

  const currentChannel = useChannelStore(state => state.currentChannel) // Zustand Store
  const { data: participants, isLoading: isLoadingParticipants, error: participantsError } = useParticipantsByChannelId(currentChannel.channelId) // API Query

  const onlineParticipants = participants?.filter(participant => participant.isOnline) ?? [];
  const offlineParticipants = participants?.filter(participant => !participant.isOnline) ?? [];

  const handleParticipantClick = (participant: ParticipantModel, event: React.MouseEvent) => {
    const liElement = (event.target as HTMLElement).closest('li');
    if (liElement) {
      const rect = liElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const modalHeight = 220;
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
    setSelectedParticipant(participant);
    (document.getElementById('participant-modal') as HTMLDialogElement).showModal()
  };

  // const handleNicknameChange = (updatedProfile: ProfileModel) => {
  //   setProfiles(prevProfiles => 
  //     prevProfiles.map(profile =>
  //       profile.id === updatedProfile.id
  //         ? { ...profile, nickname: updatedProfile.nickname }
  //         : profile
  //     )
  //   );
  // };

  // const handleOnlineStatusChange = (updatedProfile: ProfileModel) => {
  //   setProfiles(prevProfiles => 
  //     prevProfiles.map(profile =>
  //       profile.id === updatedProfile.id
  //         ? { ...profile, isOnline: updatedProfile.isOnline }
  //         : profile
  //     )
  //   );
  // };

  // SSE Custom Hook
  // const sseUrl = process.env.NEXT_PUBLIC_SERVER_A_SSE_URL as string
  // useSSE(sseUrl, {
  //   'nickname-change': handleNicknameChange,
  //   'online-status-change': handleOnlineStatusChange
  // });


  const renderContent = (title: string, filteredParticipant: ParticipantModel[]) => (
    <ul className="menu">
      <li className="menu-title">{title} - {filteredParticipant.length}</li>        
      {isLoadingParticipants ? (
        <li>
          <button className="skeleton rounded-btn h-12"></button>
        </li>
      ) : participantsError ? (
        <li>
          <button className="text-warning rounded-btn">
            알 수 없는 오류가 발생했습니다.
          </button>
        </li>
      ) : !participants ? (
        <li>
          <button className="text-warning rounded-btn">
            데이터를 불러오지 못했습니다.
          </button>
        </li>
      ) : (
        <>
          {filteredParticipant.map((participant) => (
            <li key={participant.participantId}>
              <button onClick={(e) => handleParticipantClick(participant, e)}>
                <div className="avatar online placeholder">
                  <div className="w-8 rounded-full bg-neutral text-neutral-content">
                    {/* <img src={participant.profileImgUrl} alt="profile_image" /> */}
                    A
                  </div>
                </div>
                <p className="overflow-hidden truncate whitespace-nowrap">{participant.nickname}</p>
              </button>
            </li>
          ))}
        </>
      )}
    </ul>
  )

  return (
    <>
      {renderContent("온라인", onlineParticipants)}
      {renderContent("오프라인", offlineParticipants)}

      {/* participant modal dialog */}
      <dialog id="participant-modal" className="modal modal-bottom lg:modal-middle">
        <div className="modal-box lg:fixed lg:right-64 lg:p-4" style={{
          top: modalPosition.top,
          bottom: modalPosition.bottom
        }}>
          {selectedParticipant && (
            <ParticipantModal profileId={selectedParticipant.profileId}/>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>닫기</button>
        </form>
      </dialog>
    </>
  );
}
