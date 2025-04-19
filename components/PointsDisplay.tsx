import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { Coins } from 'lucide-react-native';

interface PointsDisplayProps {
  points: number;
  compact?: boolean;
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({
  points,
  compact = false,
}) => {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Coins size={16} color={colors.accent} />
        <Text style={styles.compactText}>{points}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Coins size={24} color={colors.accent} />
      </View>
      <View>
        <Text style={styles.pointsLabel}>Your Points</Text>
        <Text style={styles.pointsValue}>{points}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  iconContainer: {
    backgroundColor: colors.gray[100],
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  pointsLabel: {
    fontSize: 14,
    color: colors.gray[600],
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compactText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
});