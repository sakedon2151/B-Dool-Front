import { create } from 'zustand';
import { createMemberSlice, MemberSlice } from './slices/memberSlice';

type StoreState = MemberSlice;

export const useStore = create<StoreState>()((...a) => ({
  ...createMemberSlice(...a),
}));