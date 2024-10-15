import { ChannelModel } from "@/app/models/channel.model";
import { useChannelsByWorkspaceId } from "@/app/queries/channel.query";
import { useChannelStore } from "@/app/stores/channel.store";
import { HiHashtag, HiOutlineStar, HiOutlineUser } from "react-icons/hi2";

interface ChannelListProps {
  workspaceId: number;
}

export default function ChannelList({ workspaceId }: ChannelListProps) {
  const { data: channels, isLoading: isLoadingChannels, error: channelsError } = useChannelsByWorkspaceId(workspaceId) // API Query
  const setCurrentChannel = useChannelStore(state => state.setCurrentChannel) // Zustand Store
  
  
  const renderChannelList = (channels: ChannelModel[], isDM: boolean) => (
    <ul>
      {channels
        .filter(channel => isDM ? channel.channelType === "DM" : channel.channelType !== "DM")
        .map((channel) => (
          <li key={channel.channelId} onClick={() => setCurrentChannel(channel)}>
            <a>
              {isDM ? <HiOutlineUser className="w-4 h-4"/> : <HiHashtag className="w-4 h-4"/>}
              <p className="overflow-hidden truncate whitespace-nowrap">{channel.name}</p>
              <button>
                <HiOutlineStar className="w-4 h-4"/>
              </button>
            </a>
          </li>
        ))}
    </ul>
  );

  const renderContent = (title: string, isDM: boolean) => (
    <li>
      <details open>
        <summary className="font-bold ">{title}</summary>
        {isLoadingChannels ? (
          <ul>
            <li className="skeleton h-9 rounded-btn">채널 로드중</li>
            <li className="skeleton h-9 rounded-btn">채널 로드중</li>
            <li className="skeleton h-9 rounded-btn">채널 로드중</li>
            <li className="skeleton h-9 rounded-btn">채널 로드중</li>
          </ul>
        ) : channelsError ? (
          <ul>
            <li className="h-9 bg-error rounded-btn">에러가 발생했습니다.</li>
          </ul>
        ) : !channels ? (
          <ul>
            <li className="h-9">채널을 찾을 수 없습니다.</li>
          </ul>
        ) : (
          renderChannelList(channels, isDM)
        )}
      </details>
    </li>
  );

  return (
    <ul className="menu">
      {renderContent("워크스페이스 채널", false)}
      {renderContent("다이렉트 메시지", true)}
    </ul>
  );
}