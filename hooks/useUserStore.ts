import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { useAuthStore } from './useAuthStore';

interface UserState {
  isLoading: boolean;
  checkIn: () => boolean;
  addPoints: (points: number) => void;
  resetStreak: () => void;
  incrementStreak: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoading: true,
      
      checkIn: () => {
        const authStore = useAuthStore.getState();
        const currentUser = authStore.getCurrentUser();
        if (!currentUser) return false;
        
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        // Check if already checked in today
        if (currentUser.lastCheckIn && currentUser.lastCheckIn.startsWith(today)) {
          return false;
        }
        
        // Check if streak should continue or reset
        let newStreak = currentUser.streak;
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (currentUser.lastCheckIn && currentUser.lastCheckIn.startsWith(yesterdayStr)) {
          // Continue streak
          newStreak += 1;
        } else if (!currentUser.lastCheckIn || !currentUser.lastCheckIn.startsWith(today)) {
          // Reset streak if not checked in yesterday and not already checked in today
          newStreak = 1;
        }
        
        // Award streak bonus points
        let bonusPoints = 0;
        if (newStreak === 7) bonusPoints = 50;
        else if (newStreak === 14) bonusPoints = 100;
        else if (newStreak === 30) bonusPoints = 200;
        
        const updatedUser = {
          ...currentUser,
          lastCheckIn: now.toISOString(),
          streak: newStreak,
          points: currentUser.points + 10 + bonusPoints, // 10 points for check-in + any bonus
        };
        
        authStore.updateUser(currentUser.id, updatedUser);
        
        return true;
      },
      
      addPoints: (points: number) => {
        const authStore = useAuthStore.getState();
        const currentUser = authStore.getCurrentUser();
        if (!currentUser) return;
        
        const updatedUser = {
          ...currentUser,
          points: currentUser.points + points,
        };
        
        authStore.updateUser(currentUser.id, updatedUser);
      },
      
      resetStreak: () => {
        const authStore = useAuthStore.getState();
        const currentUser = authStore.getCurrentUser();
        if (!currentUser) return;
        
        const updatedUser = {
          ...currentUser,
          streak: 0,
        };
        
        authStore.updateUser(currentUser.id, updatedUser);
      },
      
      incrementStreak: () => {
        const authStore = useAuthStore.getState();
        const currentUser = authStore.getCurrentUser();
        if (!currentUser) return;
        
        const updatedUser = {
          ...currentUser,
          streak: currentUser.streak + 1,
        };
        
        authStore.updateUser(currentUser.id, updatedUser);
      },
    }),
    {
      name: 'user-actions-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);