import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reward, RedeemedReward } from '@/types';
import { generateRandomId } from '@/utils/helpers';
import { useAuthStore } from './useAuthStore';
import { useUserStore } from './useUserStore';

interface RewardsState {
  availableRewards: Reward[];
  redeemedRewards: RedeemedReward[];
  isLoading: boolean;
  redeemReward: (rewardId: string) => RedeemedReward | null;
  getRedeemedRewards: () => RedeemedReward[];
  getUserRedeemedRewards: (userId: string) => RedeemedReward[];
}

// Sample rewards data
const sampleRewards: Reward[] = [
  {
    id: '1',
    title: 'Meditation App - 1 Month Free',
    description: 'Get one month free access to premium meditation content',
    pointsCost: 500,
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Mental Health E-Book Bundle',
    description: 'Collection of 3 e-books on mindfulness and mental wellness',
    pointsCost: 350,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Sleep Sounds Premium',
    description: '3 months access to premium sleep and relaxation sounds',
    pointsCost: 600,
    image: 'https://images.unsplash.com/photo-1511295742362-92c96b1cf484?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Wellness Journal Template',
    description: 'Digital template for tracking habits and wellness goals',
    pointsCost: 200,
    image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Yoga Class Voucher',
    description: 'One free online yoga class with certified instructors',
    pointsCost: 450,
    image: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=400&auto=format&fit=crop',
  }
];

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      availableRewards: sampleRewards,
      redeemedRewards: [],
      isLoading: true,
      
      redeemReward: (rewardId: string) => {
        const reward = get().availableRewards.find(r => r.id === rewardId);
        if (!reward) return null;
        
        const currentUser = useAuthStore.getState().getCurrentUser();
        if (!currentUser) return null;
        
        if (currentUser.points < reward.pointsCost) return null;
        
        // Generate a random voucher code
        const voucherCode = `${reward.id.toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        
        const redeemedReward: RedeemedReward = {
          id: generateRandomId(),
          rewardId: reward.id,
          redeemedAt: new Date().toISOString(),
          code: voucherCode,
          userId: currentUser.id
        };
        
        // Deduct points from user
        useUserStore.getState().addPoints(-reward.pointsCost);
        
        // Add to redeemed rewards
        set((state) => ({
          redeemedRewards: [redeemedReward, ...state.redeemedRewards],
        }));
        
        return redeemedReward;
      },
      
      getRedeemedRewards: () => {
        const currentUser = useAuthStore.getState().getCurrentUser();
        if (!currentUser) return [];
        
        return get().redeemedRewards.filter(reward => reward.userId === currentUser.id);
      },
      
      getUserRedeemedRewards: (userId: string) => {
        return get().redeemedRewards.filter(reward => reward.userId === userId);
      },
    }),
    {
      name: 'rewards-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);