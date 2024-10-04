import { create } from "zustand";
import { ChannelModel, InitialChannel } from "../models/channel.model";

interface ChannelState { // 채널 서비스 상태 관리
  channels: ChannelModel[]; // 해당 워크스페이스 채널 리스트
  selectedChannel: ChannelModel; // 선택한 채널 리스트
}

interface ChannelActions { // 채널 서비스 상태 액션
  addChannels:
  removeChannels:
  selectChannel:
  
}

const useChannelStore = create<>

