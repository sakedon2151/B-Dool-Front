import { InitialParticipant, ParticipantModel } from '../models/participant.model';
import { createPersistStore } from './session.middleware';

interface ParticipantState {
  currentParticipant: ParticipantModel;
  setCurrentParticipant: (participant: ParticipantModel) => void
  fetchedParticipants: ParticipantModel[];
  setFetchedParticipants: (participants: ParticipantModel[]) => void
}

export const useParticipantStore = createPersistStore<ParticipantState>(
  (set) => ({
    currentParticipant: InitialParticipant,
    setCurrentParticipant: (participant) => set({ currentParticipant: participant }),
    fetchedParticipants: [],
    setFetchedParticipants: (participants) => set({ fetchedParticipants: participants })
  }),
  'participant-storage'
);