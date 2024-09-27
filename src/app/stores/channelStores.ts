import { create } from "zustand";
import { ChannelMinimumModel } from "../models/channel.model";

interface MinimumChannelStore {
  selectedChannel: ChannelMinimumModel;
  setSelectedChannel: (channel: ChannelMinimumModel) => void;
}

const DEFAULT_CHANNEL: ChannelMinimumModel = {
  channelId: "default-channel-id",
  name: "General"
};

export const useChannelStore = create<MinimumChannelStore>((set) => ({
  selectedChannel: DEFAULT_CHANNEL,
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
}));
