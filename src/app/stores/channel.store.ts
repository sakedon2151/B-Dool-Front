import { ChannelModel, InitialChannel } from '../models/channel.model';
import { createPersistStore } from './session.middleware';

interface ChannelState {
  currentChannel: ChannelModel;
  setCurrentChannel: (channel: ChannelModel) => void
  fetchedChannels: ChannelModel[];
  setFetchedChannels: (channels: ChannelModel[]) => void
}

export const useChannelStore = createPersistStore<ChannelState>(
  (set) => ({
    currentChannel: InitialChannel,
    setCurrentChannel: (channel) => set({ currentChannel: channel }),
    fetchedChannels: [],
    setFetchedChannels: (channels) => set({ fetchedChannels: channels })
  }),
  'channel-storage'
);