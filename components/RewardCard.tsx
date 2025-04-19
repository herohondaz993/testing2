import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Reward } from '@/types';
import { colors } from '@/constants/colors';
import { Card } from './Card';
import { Coins } from 'lucide-react-native';

interface RewardCardProps {
  reward: Reward;
  onPress: () => void;
  disabled?: boolean;
  userPoints: number;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  onPress,
  disabled = false,
  userPoints,
}) => {
  const canAfford = userPoints >= reward.pointsCost;

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={disabled || !canAfford}
    >
      <Card 
        variant="elevated" 
        style={[
          styles.card,
          !canAfford && styles.disabledCard
        ]}
        padding="none"
      >
        <Image 
          source={{ uri: reward.image }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{reward.title}</Text>
          <Text style={styles.description}>{reward.description}</Text>
          
          <View style={styles.footer}>
            <View style={styles.pointsContainer}>
              <Coins size={16} color={colors.accent} />
              <Text style={styles.pointsText}>{reward.pointsCost} points</Text>
            </View>
            
            {!canAfford && (
              <Text style={styles.insufficientText}>
                Need {reward.pointsCost - userPoints} more
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  disabledCard: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  insufficientText: {
    fontSize: 12,
    color: colors.error,
  },
});