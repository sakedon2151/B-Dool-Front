import { ChannelModel } from "@/app/models/channel.model";
import { channelService } from "@/app/services/channel/channel.api";
import { useChannelStore } from "@/app/stores/channelStores";
import { useEffect, useState } from "react";
import { HiHashtag, HiOutlineStar, HiOutlineUser } from "react-icons/hi2";

interface ChannelListProps {
  workspaceId: number;
}

export default function ChannelList({ workspaceId }: ChannelListProps) {
  const setSelectedChannel = useChannelStore((state) => state.setSelectedChannel)
  const [channels, setChannels] = useState<ChannelModel[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (workspaceId && typeof workspaceId === 'number') {
      fetchChannels(workspaceId);
    }
  }, [workspaceId]);

  const fetchChannels = async (workspaceId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await channelService.getChannelsByWorkspaceId(workspaceId);
      setChannels(response);
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      setError('채널 목록을 불러오는데 실패했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setIsLoading(false)
    }
  };
  
  return (
    <ul className="menu">
      <li>
        <details open>
          <summary className="font-bold ">워크스페이스 채널</summary>
          {!channels ? (
            <p>채널 불러오는 중</p>
          ) : channels.length === 0 ? (
            <ul>
              <li className="">
                <a className="text-center">채널 추가하기</a>
              </li>
              <li>
                  <a>
                    <HiHashtag className="w-4 h-4" />
                    <p className="overflow-hidden truncate whitespace-nowrap">111</p>
                    <button>
                      <HiOutlineStar className="w-4 h-4" />
                    </button>
                  </a>
                </li>  
            </ul>
          ) : (
            <ul>
              {channels.map((channel) => (
                <li 
                  key={channel.channelId} onClick={() => setSelectedChannel(channel)}>
                  <a>
                    <HiHashtag className="w-4 h-4" />
                    <p className="overflow-hidden truncate whitespace-nowrap">{channel.name}</p>
                    <button>
                      <HiOutlineStar className="w-4 h-4" />
                    </button>
                  </a>
                </li>  
              ))}
            </ul>
          )}
        </details>
      </li>
    </ul>
  );
}
