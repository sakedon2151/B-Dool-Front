import { create } from "zustand";
import { ChannelModel, InitialChannel } from "../models/channel.model";

interface SelectedChannelStore {
  selectedChannel: ChannelModel;
  setSelectedChannel: (channel: ChannelModel) => void;
}

const InitialSelectedChannelStore = InitialChannel;

export const useChannelStore = create<SelectedChannelStore>((set) => ({
  selectedChannel: InitialSelectedChannelStore,
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
}));
