import { useEffect, useState } from "react";
import { useChannelsByWorkspaceId } from "@/app/queries/channel.query";
import ChannelCreateModal from "./ChannelCreateModal";
import { ChannelModel } from "@/app/models/channel.model";
import { useChannelStore } from "@/app/stores/channel.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag, faLock, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { useProfileStore } from "@/app/stores/profile.store";
import { useParticipantsByProfileIdAndChannelId } from "@/app/queries/participant.query";
import { useParticipantStore } from "@/app/stores/participant.store";
import toast from "react-hot-toast";

interface ChannelListProps {
  workspaceId: number;
}

export default function ChannelList({ workspaceId }: ChannelListProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  const currentProfile = useProfileStore(state => state.currentProfile) // Zustand Store
  const setCurrentChannel = useChannelStore(state => state.setCurrentChannel) // Zustand Store
  const setCurrentParticipant = useParticipantStore(state => state.setCurrentParticipant) // Zustand Store

  const { data: channels, isLoading: isLoadingChannels, error: channelsError } = useChannelsByWorkspaceId(workspaceId) // API Query
  const { data: participant, isLoading: isLoadingParticipant } = useParticipantsByProfileIdAndChannelId(currentProfile.id, selectedChannelId!, {
    enabled: !!selectedChannelId && !!currentProfile.id,
  }) // API Query

  useEffect(() => {
    const dialog = document.getElementById('channel-modal') as HTMLDialogElement;
    const handleClose = () => {
      if (!dialog.open) {
        setIsModalOpen(false);
      }
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  const handleModalOpen = () => {
    setIsModalOpen(true);
    (document.getElementById('channel-modal') as HTMLDialogElement).showModal();
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
    (document.getElementById('channel-modal') as HTMLDialogElement).close();
  }

  const handleChannelSelect = async (channel: ChannelModel) => {
    try {
      if (selectedChannelId === channel.channelId) {
        return;
      }
      setCurrentParticipant(null); // 이전 필드 초기화
      setCurrentChannel(channel);
      setSelectedChannelId(channel.channelId);
    } catch (error) {
      toast.error('채널 선택 중 오류가 발생했습니다.');
      setSelectedChannelId(null);
      setCurrentParticipant(null);
    }
  };

  useEffect(() => {
    if (!isLoadingParticipant) {
      if (participant) {
        setCurrentParticipant(participant);
      } else if (selectedChannelId) {
        toast.error('채널 접근 권한이 없습니다.');
        setCurrentParticipant(null)
      }  
    }
  }, [participant, isLoadingParticipant, setCurrentParticipant, selectedChannelId]);

  const renderChannelList = (channels: ChannelModel[], isDM: boolean) => (
    <ul className="ms-2">
      {channels
        .filter(channel => isDM ? channel.channelType === "DM" : channel.channelType !== "DM")
        .map((channel) => (
          <li key={channel.channelId} onClick={() => handleChannelSelect(channel)}>
            <button className="p-2">
              {isDM ? <FontAwesomeIcon icon={faUser} className="w-4 h-4 opacity-75"/> : <FontAwesomeIcon icon={faHashtag} className="w-4 h-4 opacity-75"/>}
              <p className="overflow-hidden truncate whitespace-nowrap">{channel.name}</p>
              {channel.isPrivate ? <FontAwesomeIcon icon={faLock} className="w-4 h-4 opacity-75"/> : '' }
            </button>
          </li>
        ))}
    </ul>
  );

  const renderContent = (title: string, isDM: boolean) => (
    <li>
      <details open>
        <summary className="font-bold opacity-75 p-2 after:absolute after:right-[14px]">{title}</summary>
        {isLoadingChannels ? (
          <ul className="ms-2">
            <li>
              <button className="skeleton h-9 rounded-btn"></button>
            </li>
          </ul>
        ) : channelsError ? (
          <ul className="ms-2">
            <li>
              <button className="p-2 text-error rounded-btn">
                알 수 없는 오류가 발생했습니다.
              </button>
            </li>
          </ul>
        ) : !channels ? (
          <ul className="ms-2">
            <li>
              <button className="p-2 text-warning rounded-btn">
                데이터를 불러오지 못했습니다.
              </button>
            </li>
          </ul>
        ) : (
          renderChannelList(channels, isDM)
        )}
      </details>
    </li>
  );

  return (
    <>
      <ul className="menu">
        {renderContent("워크스페이스 채널", false)}
        {renderContent("다이렉트 메시지", true)}
      </ul>

      <button className="btn w-[176px] absolute bottom-[72px] right-[8px]" onClick={handleModalOpen}>
        <FontAwesomeIcon icon={faPlus} className="w-4 h-4 opacity-75"/>
        채널 생성
      </button>

      {/* channel create modal dialog */}
      <dialog id="channel-modal" className="modal modal-bottom md:modal-middle">
        <div className="modal-box p-4">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-50" onClick={handleModalClose}>✕</button>
          </form>
          <ChannelCreateModal isOpen={isModalOpen} onClose={handleModalClose} />
        </div>
        
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleModalClose}>닫기</button>
        </form>
      </dialog>
    </>
  );
}