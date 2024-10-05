// src/shared/middlewares/persistMiddleware.ts
import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { PersistOptions, persist } from 'zustand/middleware';

type ConfigOptions = {
  name: string;
  storage?: PersistOptions<unknown>['storage'];
};

type Persist = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: ConfigOptions
) => (
  initializer: StateCreator<T, [...Mps, ['zustand/persist', unknown]], Mcs>
) => StateCreator<T, Mps, Mcs>;

export const createPersistMiddleware: Persist = (config) => (initializer) => 
  persist(initializer, {
    name: config.name,
    storage: config.storage,
  }) as StateCreator<any, any, any>;