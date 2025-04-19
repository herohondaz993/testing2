import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, Mood } from '@/types';
import { generateRandomId } from '@/utils/helpers';
import { useAuthStore } from './useAuthStore';

interface JournalState {
  entries: JournalEntry[];
  isLoading: boolean;
  addEntry: (content: string, mood: Mood, tags: string[]) => JournalEntry | null;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => JournalEntry | undefined;
  getEntriesByDate: (date: string) => JournalEntry[];
  getEntriesByUserId: (userId: string) => JournalEntry[];
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      isLoading: true,
      
      addEntry: (content: string, mood: Mood, tags: string[]) => {
        const currentUser = useAuthStore.getState().getCurrentUser();
        if (!currentUser) return null;
        
        const newEntry: JournalEntry = {
          id: generateRandomId(),
          content,
          mood,
          date: new Date().toISOString(),
          tags,
          userId: currentUser.id
        };
        
        set((state) => ({
          entries: [newEntry, ...state.entries],
        }));
        
        return newEntry;
      },
      
      updateEntry: (id: string, updates: Partial<JournalEntry>) => {
        set((state) => ({
          entries: state.entries.map((entry) => 
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        }));
      },
      
      deleteEntry: (id: string) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },
      
      getEntry: (id: string) => {
        return get().entries.find((entry) => entry.id === id);
      },
      
      getEntriesByDate: (date: string) => {
        const currentUser = useAuthStore.getState().getCurrentUser();
        if (!currentUser) return [];
        
        return get().entries.filter((entry) => 
          entry.date.startsWith(date) && entry.userId === currentUser.id
        );
      },
      
      getEntriesByUserId: (userId: string) => {
        return get().entries.filter((entry) => entry.userId === userId);
      },
    }),
    {
      name: 'journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);