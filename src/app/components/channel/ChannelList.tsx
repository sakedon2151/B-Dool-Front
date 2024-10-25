import { useEffect, useState } from "react";
import { useChannelsByWorkspaceId } from "@/app/queries/channel.query";
import ChannelCreateModal from "./ChannelCreateModal";
import { ChannelModel } from "@/app/models/channel.model";
import { useChannelStore } from "@/app/stores/channel.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag, faLock, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";

interface ChannelListProps {
  workspaceId: number;
}

export default function ChannelList({ workspaceId }: ChannelListProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const { data: channels, isLoading: isLoadingChannels, error: channelsError } = useChannelsByWorkspaceId(workspaceId) // API Query
  const setCurrentChannel = useChannelStore(state => state.setCurrentChannel) // Zustand Store

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
    setIsModalOpen(false);  // 모달 상태 변경
    (document.getElementById('channel-modal') as HTMLDialogElement).close(); // 모달 닫기
    // TODO: toast 메시지 출력 - 채널이 추가되었습니다.
  }

  const renderChannelList = (channels: ChannelModel[], isDM: boolean) => (
    <ul className="ms-2">
      {channels
        .filter(channel => isDM ? channel.channelType === "DM" : channel.channelType !== "DM")
        .map((channel) => (
          <li key={channel.channelId} onClick={() => setCurrentChannel(channel)}>
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
              <div className="skeleton h-9 rounded-btn"></div>
            </li>
          </ul>
        ) : channelsError ? (
          <ul className="ms-2">
            <li>
              <div className="p-2 bg-error rounded-btn">
                알 수 없는 오류가 발생했습니다.
              </div>
            </li>
          </ul>
        ) : !channels ? (
          <ul className="ms-2">
            <li>
              <div className="p-2 bg-warning rounded-btn">
                데이터를 불러오지 못했습니다.
              </div>
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
        <p>채널 생성</p>
      </button>

      {/* modal dialog */}
      <dialog id="channel-modal" className="modal modal-bottom md:modal-middle">
        <div className="modal-box p-4">
          <ChannelCreateModal isOpen={isModalOpen} onClose={handleModalClose} />
          <div className="modal-action absolute bottom-4 right-4">
            <form method="dialog">
              <button className="btn" onClick={handleModalClose}>취소</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}