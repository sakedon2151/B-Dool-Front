import { create } from "zustand";

interface MinimumChannelStore {
  selectedChannel: ChannelMinimumModel | null;
  setSelectedChannel: (channel: ChannelMinimumModel) => void;
}

export const useChannelStore = create<MinimumChannelStore>((set) => ({
  selectedChannel: null,
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
}));
