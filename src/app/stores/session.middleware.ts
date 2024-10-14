import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

const createSessionStoragePersistOptions = <T>(name: string): PersistOptions<T> => ({
  name,
  storage: {
    getItem: (name) => {
      const str = sessionStorage.getItem(name);
      return str ? JSON.parse(str) : null;
    },
    setItem: (name, value) => {
      sessionStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => sessionStorage.removeItem(name),
  },
});

export const createPersistStore = <T extends object>(
  initialState: StateCreator<T>,
  name: string
) => {
  return create(
    persist(initialState, createSessionStoragePersistOptions<T>(name))
  );
};