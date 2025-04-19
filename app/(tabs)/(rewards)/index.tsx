import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useRewardsStore } from '@/hooks/useRewardsStore';
import { PointsDisplay } from '@/components/PointsDisplay';
import { RewardCard } from '@/components/RewardCard';
import { Button } from '@/components/Button';
import { Gift } from 'lucide-react-native';

export default function RewardsScreen() {
  const router = useRouter();
  const { getCurrentUser } = useAuthStore();
  const { availableRewards, redeemReward } = useRewardsStore();
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  const user = getCurrentUser();
  
  const handleRedeemReward = (rewardId: string) => {
    if (!user) return;
    
    const reward = availableRewards.find(r => r.id === rewardId);
    if (!reward) return;
    
    if (user.points < reward.pointsCost) {
      Alert.alert(
        'Insufficient Points',
        `You need ${reward.pointsCost - user.points} more points to redeem this reward.`
      );
      return;
    }
    
    setIsRedeeming(true);
    
    // Simulate API call
    setTimeout(() => {
      const redeemedReward = redeemReward(rewardId);
      
      setIsRedeeming(false);
      
      if (redeemedReward) {
        Alert.alert(
          'Reward Redeemed!',
          `You've successfully redeemed "${reward.title}". Your voucher code is: ${redeemedReward.code}`,
          [
            {
              text: 'View My Vouchers',
              onPress: () => router.push('/(tabs)/(rewards)/redeemed'),
            },
            {
              text: 'OK',
              style: 'cancel',
            },
          ]
        );
      } else {
        Alert.alert(
          'Error',
          'There was an error redeeming this reward. Please try again.'
        );
      }
    }, 1000);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.pointsContainer}>
          {user && <PointsDisplay points={user.points} />}
        </View>
        
        <Button
          title="My Vouchers"
          onPress={() => router.push('/(tabs)/(rewards)/redeemed')}
          variant="outline"
          size="small"
          leftIcon={<Gift size={16} color={colors.primary} />}
          style={styles.vouchersButton}
        />
      </View>
      
      <Text style={styles.title}>Available Rewards</Text>
      <Text style={styles.subtitle}>
        Redeem your points for these exclusive rewards
      </Text>
      
      <FlatList
        data={availableRewards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RewardCard
            reward={item}
            onPress={() => handleRedeemReward(item.id)}
            disabled={isRedeeming}
            userPoints={user?.points || 0}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  pointsContainer: {
    flex: 1,
    marginRight: 16,
  },
  vouchersButton: {
    minWidth: 120,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[600],
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
});