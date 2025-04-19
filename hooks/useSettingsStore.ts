import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '@/types';

interface SettingsStore extends AppSettings {
  isLoading: boolean;
  setOpenAiApiKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      openAiApiKey: null,
      isLoading: true,
      
      setOpenAiApiKey: (key: string) => {
        set({ openAiApiKey: key });
      }
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);