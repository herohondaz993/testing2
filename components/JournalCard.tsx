import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { JournalEntry } from '@/types';
import { colors, moodColors } from '@/constants/colors';
import { Card } from './Card';
import { getRelativeTime, truncateText } from '@/utils/helpers';
import { Smile, Laugh, Meh, Frown, AlertCircle, ChevronRight } from 'lucide-react-native';

interface JournalCardProps {
  entry: JournalEntry;
  onPress: () => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({ entry, onPress }) => {
  const getMoodIcon = () => {
    switch (entry.mood) {
      case 'joyful':
        return <Laugh size={20} color={moodColors.joyful} />;
      case 'happy':
        return <Smile size={20} color={moodColors.happy} />;
      case 'neutral':
        return <Meh size={20} color={moodColors.neutral} />;
      case 'sad':
        return <Frown size={20} color={moodColors.sad} />;
      case 'stressed':
        return <AlertCircle size={20} color={moodColors.stressed} />;
      default:
        return <Meh size={20} color={moodColors.neutral} />;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.moodContainer}>
            {getMoodIcon()}
            <Text style={styles.moodText}>
              {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
            </Text>
          </View>
          <Text style={styles.date}>{getRelativeTime(entry.date)}</Text>
        </View>
        
        <Text style={styles.content}>
          {truncateText(entry.content, 120)}
        </Text>
        
        {entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {entry.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {entry.tags.length > 3 && (
              <Text style={styles.moreTag}>+{entry.tags.length - 3}</Text>
            )}
          </View>
        )}
        
        {entry.analysis && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Mental Health Score</Text>
            <View style={styles.scoreBar}>
              <View 
                style={[
                  styles.scoreFill, 
                  { 
                    width: `${entry.analysis.score}%`,
                    backgroundColor: getScoreColor(entry.analysis.score)
                  }
                ]} 
              />
            </View>
            <Text style={styles.scoreValue}>{entry.analysis.score}</Text>
          </View>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.viewDetails}>View details</Text>
          <ChevronRight size={16} color={colors.primary} />
        </View>
      </Card>
    </TouchableOpacity>
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
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    color: colors.gray[700],
  },
  date: {
    fontSize: 12,
    color: colors.gray[500],
  },
  content: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.gray[700],
  },
  moreTag: {
    fontSize: 12,
    color: colors.gray[500],
    alignSelf: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.gray[600],
    marginRight: 8,
  },
  scoreBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.gray[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 3,
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[700],
    marginLeft: 8,
    width: 24,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewDetails: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
});