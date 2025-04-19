import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { colors, moodColors } from '@/constants/colors';
import { useJournalStore } from '@/hooks/useJournalStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { formatDate, formatTime } from '@/utils/helpers';
import { Smile, Laugh, Meh, Frown, AlertCircle, Trash2 } from 'lucide-react-native';

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getEntry, deleteEntry } = useJournalStore();
  
  const entry = getEntry(id);
  
  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Entry not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  const getMoodIcon = () => {
    switch (entry.mood) {
      case 'joyful':
        return <Laugh size={24} color={moodColors.joyful} />;
      case 'happy':
        return <Smile size={24} color={moodColors.happy} />;
      case 'neutral':
        return <Meh size={24} color={moodColors.neutral} />;
      case 'sad':
        return <Frown size={24} color={moodColors.sad} />;
      case 'stressed':
        return <AlertCircle size={24} color={moodColors.stressed} />;
      default:
        return <Meh size={24} color={moodColors.neutral} />;
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteEntry(entry.id);
            router.back();
          },
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          headerRight: () => (
            <Button
              title=""
              onPress={handleDelete}
              variant="ghost"
              leftIcon={<Trash2 size={20} color={colors.error} />}
            />
          ),
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{formatDate(entry.date)}</Text>
            <Text style={styles.time}>{formatTime(entry.date)}</Text>
          </View>
          
          <View style={styles.moodContainer}>
            {getMoodIcon()}
            <Text style={styles.moodText}>
              {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{entry.content}</Text>
        </View>
        
        {entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsLabel}>Tags</Text>
            <View style={styles.tagsList}>
              {entry.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {entry.analysis && (
          <Card style={styles.analysisCard}>
            <Text style={styles.analysisTitle}>Mental Health Insights</Text>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Emotional Wellbeing Score</Text>
              <View style={styles.scoreBarContainer}>
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
            </View>
            
            <Text style={styles.summaryLabel}>Summary</Text>
            <Text style={styles.summary}>{entry.analysis.summary}</Text>
            
            {entry.analysis.appreciation && (
              <View style={styles.appreciationContainer}>
                <Text style={styles.appreciationText}>
                  {entry.analysis.appreciation}
                </Text>
              </View>
            )}
            
            <Text style={styles.suggestionsLabel}>Suggestions</Text>
            <View style={styles.suggestionsList}>
              {entry.analysis.suggestions.map((suggestion, index) => (
                <View key={index} style={styles.suggestion}>
                  <Text style={styles.suggestionNumber}>{index + 1}</Text>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
            
            {entry.analysis.keywords.length > 0 && (
              <>
                <Text style={styles.keywordsLabel}>Key Emotions</Text>
                <View style={styles.keywordsList}>
                  {entry.analysis.keywords.map((keyword, index) => (
                    <View key={index} style={styles.keyword}>
                      <Text style={styles.keywordText}>{keyword}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getScoreColor = (score: number) => {
  if (score >= 80) return moodColors.joyful;
  if (score >= 60) return moodColors.happy;
  if (score >= 40) return moodColors.neutral;
  if (score >= 20) return moodColors.sad;
  return moodColors.stressed;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dateContainer: {
    flex: 1,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 4,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  moodText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  contentContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  content: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  analysisCard: {
    marginBottom: 24,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  scoreContainer: {
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 14,
    color: colors.gray[700],
    marginBottom: 8,
  },
  scoreBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
    width: 30,
    textAlign: 'right',
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  summary: {
    fontSize: 15,
    color: colors.gray[700],
    lineHeight: 22,
    marginBottom: 16,
  },
  appreciationContainer: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  appreciationText: {
    fontSize: 14,
    color: colors.gray[800],
    fontStyle: 'italic',
    lineHeight: 20,
  },
  suggestionsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  suggestionsList: {
    marginBottom: 16,
  },
  suggestion: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  suggestionNumber: {
    width: 24,
    height: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
    color: colors.gray[700],
    lineHeight: 22,
  },
  keywordsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keyword: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  keywordText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.gray[600],
    marginBottom: 16,
  },
  backButton: {
    minWidth: 120,
  },
});