import { create } from "zustand";
import { ChannelStoreModel } from "../models/channel.model";

interface SelectedChannelStore {
  selectedChannel: ChannelStoreModel;
  setSelectedChannel: (channel: ChannelStoreModel) => void;
}

const InitialSelectedChannelStore = {
  channelId: '',
  workspacesId: 1,
  name: 'General Channel',
  isPrivate: false,
  createdAt: '',
  updatedAt: '',
  description: '전체 채널',
  profileId: '',
  channelType: 'DEFAULT' as const
}

export const useChannelStore = create<SelectedChannelStore>((set) => ({
  selectedChannel: InitialSelectedChannelStore,
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
}));
