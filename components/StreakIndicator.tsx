import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { Flame } from 'lucide-react-native';
import { getStreakMessage } from '@/utils/helpers';

interface StreakIndicatorProps {
  streak: number;
  compact?: boolean;
}

export const StreakIndicator: React.FC<StreakIndicatorProps> = ({
  streak,
  compact = false,
}) => {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Flame size={16} color={colors.accent} />
        <Text style={styles.compactText}>{streak}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.streakHeader}>
        <Flame size={24} color={colors.accent} />
        <Text style={styles.streakCount}>{streak} day streak</Text>
      </View>
      <Text style={styles.streakMessage}>{getStreakMessage(streak)}</Text>
      
      {streak > 0 && streak < 7 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {7 - streak} days until next bonus
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(streak / 7) * 100}%` }
              ]} 
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.gray[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakCount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  streakMessage: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.gray[600],
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
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