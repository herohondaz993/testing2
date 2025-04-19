import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, moodColors } from '@/constants/colors';
import { JournalEntry, Mood } from '@/types';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react-native';

interface MoodTrendsProps {
  entries: JournalEntry[];
  days?: number;
}

const MoodTrends: React.FC<MoodTrendsProps> = ({ entries, days = 7 }) => {
  // Sort entries by date
  const sortedEntries = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Take the last 'days' entries
  const recentEntries = sortedEntries.slice(-days);
  
  if (recentEntries.length < 2) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>
          Not enough entries to show trends. Add more journal entries.
        </Text>
      </View>
    );
  }
  
  // Get the most recent and previous mood
  const latestEntry = recentEntries[recentEntries.length - 1];
  const previousEntry = recentEntries[recentEntries.length - 2];
  
  // Get mood scores for comparison (prioritize AI score if available)
  const getMoodScore = (entry: JournalEntry): number => {
    // If we have an AI analysis score, use that instead of the mood
    if (entry.analysis?.score !== undefined) {
      return entry.analysis.score;
    }
    
    // Fallback to mood-based score if no analysis
    switch (entry.mood) {
      case 'joyful': return 90;
      case 'happy': return 75;
      case 'neutral': return 50;
      case 'sad': return 30;
      case 'stressed': return 15;
      default: return 50;
    }
  };
  
  const latestScore = getMoodScore(latestEntry);
  const previousScore = getMoodScore(previousEntry);
  
  // Determine trend
  const scoreDifference = latestScore - previousScore;
  
  let trendIcon;
  let trendColor;
  let trendMessage;
  
  if (scoreDifference > 10) {
    trendIcon = <ArrowUp size={16} color={colors.success} />;
    trendColor = colors.success;
    trendMessage = "Your wellbeing has improved significantly!";
  } else if (scoreDifference > 5) {
    trendIcon = <ArrowUp size={16} color={colors.success} />;
    trendColor = colors.success;
    trendMessage = "Your wellbeing has improved.";
  } else if (scoreDifference < -10) {
    trendIcon = <ArrowDown size={16} color={colors.error} />;
    trendColor = colors.error;
    trendMessage = "Your wellbeing has declined significantly.";
  } else if (scoreDifference < -5) {
    trendIcon = <ArrowDown size={16} color={colors.error} />;
    trendColor = colors.error;
    trendMessage = "Your wellbeing has slightly declined.";
  } else {
    trendIcon = <Minus size={16} color={colors.gray[500]} />;
    trendColor = colors.gray[500];
    trendMessage = "Your wellbeing is relatively stable.";
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.trendContainer}>
        <View style={styles.moodComparison}>
          <View style={styles.moodItem}>
            <View 
              style={[
                styles.moodIndicator, 
                { backgroundColor: getScoreColor(previousScore) }
              ]} 
            />
            <Text style={styles.moodLabel}>Previous</Text>
            <Text style={styles.moodValue}>
              {previousEntry.analysis?.score !== undefined 
                ? previousEntry.analysis.score 
                : previousEntry.mood.charAt(0).toUpperCase() + previousEntry.mood.slice(1)}
            </Text>
          </View>
          
          <View style={styles.trendIconContainer}>
            {trendIcon}
          </View>
          
          <View style={styles.moodItem}>
            <View 
              style={[
                styles.moodIndicator, 
                { backgroundColor: getScoreColor(latestScore) }
              ]} 
            />
            <Text style={styles.moodLabel}>Current</Text>
            <Text style={styles.moodValue}>
              {latestEntry.analysis?.score !== undefined 
                ? latestEntry.analysis.score 
                : latestEntry.mood.charAt(0).toUpperCase() + latestEntry.mood.slice(1)}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.trendMessage, { color: trendColor }]}>
          {trendMessage}
        </Text>
        
        {latestEntry.analysis?.summary && (
          <Text style={styles.scoreTrendMessage}>
            {latestEntry.analysis.summary}
          </Text>
        )}
      </View>
    </View>
  );
};

const getScoreColor = (score: number) => {
  if (score >= 80) return moodColors.joyful;
  if (score >= 60) return moodColors.happy;
  if (score >= 40) return moodColors.neutral;
  if (score >= 20) return moodColors.sad;
  return moodColors.stressed;
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  trendContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  moodComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodItem: {
    alignItems: 'center',
    flex: 1,
  },
  moodIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    color: colors.gray[500],
    marginBottom: 4,
  },
  moodValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  trendIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  scoreTrendMessage: {
    fontSize: 14,
    color: colors.gray[700],
    textAlign: 'center',
  },
  noDataContainer: {
    padding: 16,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
  },
  noDataText: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
  },
});

export default MoodTrends;