// src/features/channels/stores/channelStore.ts
import { create } from 'zustand';

interface ChannelState {
  selectedChannelId: number | null;
  setSelectedChannelId: (id: number | null) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  selectedChannelId: null,
  setSelectedChannelId: (id) => set({ selectedChannelId: id }),
}));