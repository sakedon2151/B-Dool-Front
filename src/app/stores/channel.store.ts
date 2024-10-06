import { create } from 'zustand';
import { ChannelModel } from '../models/channel.model';

interface ChannelState {
  selectedChannel: ChannelModel | null; // channel 관리
  setSelectedChannel: (channel: ChannelModel | null) => void;

  fetchedChannels: ChannelModel[]; // channels 관리
  setFetchedChannels: (channels: ChannelModel[]) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  selectedChannel: null,
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),

  fetchedChannels: [],
  setFetchedChannels: (channels) => set({ fetchedChannels: channels })
}));