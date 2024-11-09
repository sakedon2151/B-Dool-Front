import { ParticipantModel } from '../models/participant.model';
import { createPersistStore } from './session.middleware';

interface ParticipantState {
  currentParticipant: ParticipantModel | null;
  setCurrentParticipant: (participant: ParticipantModel | null) => void
  fetchedParticipants: ParticipantModel[];
  setFetchedParticipants: (participants: ParticipantModel[]) => void
}

export const useParticipantStore = createPersistStore<ParticipantState>(
  (set) => ({
    currentParticipant: null,
    setCurrentParticipant: (participant) => set({ currentParticipant: participant }),
    fetchedParticipants: [],
    setFetchedParticipants: (participants) => set({ fetchedParticipants: participants })
  }),
  'participant-storage'
);