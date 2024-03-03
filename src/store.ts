import { StateStorage, createJSONStorage, persist } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { create } from "zustand";

const storage = new MMKV();
const zustandMMKVMiddleware: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

export type LogEntry = {
  label: string;
  timestamp: Date;
};

export interface LogState {
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
  removeLog: (log: LogEntry) => void;
}

export const useLogStore = create<LogState, [["zustand/persist", LogState]]>(
  persist(
    (set, get) => ({
      logs: [],
      addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
      removeLog: (log) => set((state) => ({ logs: state.logs.filter((l) => l !== log) })),
    }),
    {
      name: "logs",
      storage: createJSONStorage(() => zustandMMKVMiddleware),
      version: 1,
    },
  ),
);
