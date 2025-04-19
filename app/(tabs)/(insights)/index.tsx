import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, moodColors } from '@/constants/colors';
import { useJournalStore } from '@/hooks/useJournalStore';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import MoodPieChart from '@/components/MoodPieChart';
import ScoreLineChart from '@/components/ScoreLineChart';
import MoodTrends from '@/components/MoodTrends';
import { BarChart2, BookOpen, Calendar, ChevronDown } from 'lucide-react-native';

export default function InsightsScreen() {
  const router = useRouter();
  const { entries } = useJournalStore();
  const { getCurrentUser } = useAuthStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  
  const user = getCurrentUser();
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="Not Logged In"
          description="Please log in to view your insights."
          icon={<BarChart2 size={32} color={colors.gray[400]} />}
        />
      </SafeAreaView>
    );
  }
  
  // Get only the current user's entries
  const userEntries = entries.filter(entry => entry.userId === user.id);
  
  // Filter entries based on time range
  const getFilteredEntries = () => {
    const now = new Date();
    
    if (timeRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return userEntries.filter(entry => new Date(entry.date) >= weekAgo);
    }
    
    if (timeRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      return userEntries.filter(entry => new Date(entry.date) >= monthAgo);
    }
    
    return userEntries;
  };
  
  const filteredEntries = getFilteredEntries();
  
  // Calculate mood distribution based on AI scores if available
  const calculateMoodDistribution = () => {
    // First try to use AI scores if available
    const entriesWithScores = filteredEntries.filter(entry => entry.analysis?.score !== undefined);
    
    if (entriesWithScores.length > 0) {
      // Group by score ranges
      const scoreRanges = {
        joyful: 0,  // 80-100
        happy: 0,   // 60-79
        neutral: 0, // 40-59
        sad: 0,     // 20-39
        stressed: 0 // 0-19
      };
      
      entriesWithScores.forEach(entry => {
        const score = entry.analysis?.score || 0;
        if (score >= 80) scoreRanges.joyful++;
        else if (score >= 60) scoreRanges.happy++;
        else if (score >= 40) scoreRanges.neutral++;
        else if (score >= 20) scoreRanges.sad++;
        else scoreRanges.stressed++;
      });
      
      const totalEntries = entriesWithScores.length;
      
      return Object.entries(scoreRanges).map(([mood, count]) => ({
        mood: mood as any,
        count,
        percentage: Math.round((count / totalEntries) * 100) || 0
      }));
    } else {
      // Fallback to using mood selections if no AI scores
      const moodCounts: Record<string, number> = {};
      
      filteredEntries.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      });
      
      const totalEntries = filteredEntries.length;
      
      return Object.entries(moodCounts).map(([mood, count]) => ({
        mood: mood as any,
        count,
        percentage: Math.round((count / totalEntries) * 100) || 0
      }));
    }
  };
  
  // Calculate average score
  const calculateAverageScore = () => {
    const entriesWithAnalysis = filteredEntries.filter(entry => entry.analysis?.score !== undefined);
    
    if (entriesWithAnalysis.length === 0) return 0;
    
    const totalScore = entriesWithAnalysis.reduce((sum, entry) => sum + (entry.analysis?.score || 0), 0);
    return Math.round(totalScore / entriesWithAnalysis.length);
  };
  
  const moodDistribution = calculateMoodDistribution();
  const averageScore = calculateAverageScore();
  
  // Get time range label
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'week': return 'Past Week';
      case 'month': return 'Past Month';
      case 'all': return 'All Time';
    }
  };
  
  if (userEntries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="No Insights Yet"
          description="Start journaling to see mental health insights and trends."
          icon={<BarChart2 size={32} color={colors.gray[400]} />}
          actionLabel="Write First Entry"
          onAction={() => router.push('/(tabs)/(journal)/new')}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Mental Health Insights</Text>
          
          <TouchableOpacity 
            style={styles.timeRangeSelector}
            onPress={() => {
              // Cycle through time ranges
              if (timeRange === 'week') setTimeRange('month');
              else if (timeRange === 'month') setTimeRange('all');
              else setTimeRange('week');
            }}
          >
            <Text style={styles.timeRangeText}>{getTimeRangeLabel()}</Text>
            <ChevronDown size={16} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>
        
        <Card style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Average Wellbeing Score</Text>
          <View style={styles.scoreContainer}>
            <View style={[
              styles.scoreCircle,
              { backgroundColor: getScoreColor(averageScore) }
            ]}>
              <Text style={styles.scoreValue}>{averageScore}</Text>
            </View>
            <View style={styles.scoreDetails}>
              <Text style={styles.scoreDescription}>
                {averageScore >= 80 ? 'Excellent mental wellbeing' :
                 averageScore >= 60 ? 'Good mental wellbeing' :
                 averageScore >= 40 ? 'Moderate mental wellbeing' :
                 averageScore >= 20 ? 'Could use some self-care' :
                 'Consider seeking support'}
              </Text>
              <Text style={styles.scoreSubtext}>
                Based on {filteredEntries.filter(e => e.analysis?.score !== undefined).length} analyzed entries
              </Text>
            </View>
          </View>
        </Card>
        
        {filteredEntries.length >= 2 && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Wellbeing Over Time</Text>
            <ScoreLineChart 
              entries={filteredEntries} 
              days={timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : undefined}
            />
          </Card>
        )}
        
        <Card style={styles.moodCard}>
          <Text style={styles.moodTitle}>Mood Distribution</Text>
          {filteredEntries.length > 0 ? (
            <MoodPieChart moodDistribution={moodDistribution} />
          ) : (
            <Text style={styles.noDataText}>
              Not enough data to show mood distribution.
            </Text>
          )}
        </Card>
        
        {filteredEntries.length >= 2 && (
          <Card style={styles.trendsCard}>
            <Text style={styles.trendsTitle}>Recent Mood Trends</Text>
            <MoodTrends 
              entries={filteredEntries}
              days={timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : undefined}
            />
          </Card>
        )}
        
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Mental Health Tips</Text>
          
          <View style={styles.tipItem}>
            <View style={styles.tipNumber}>
              <Text style={styles.tipNumberText}>1</Text>
            </View>
            <Text style={styles.tipText}>
              Thoda meditation karo, tension kam hoga! Just 5-10 minutes daily.
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.tipNumber}>
              <Text style={styles.tipNumberText}>2</Text>
            </View>
            <Text style={styles.tipText}>
              Exercise se mood ekdum up ho jata hai! Try walking or yoga.
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <View style={styles.tipNumber}>
              <Text style={styles.tipNumberText}>3</Text>
            </View>
            <Text style={styles.tipText}>
              Dosto se baat karo, akele mat raho. Social connection is important!
            </Text>
          </View>
        </Card>
        
        <Button
          title="Write New Journal Entry"
          onPress={() => router.push('/(tabs)/(journal)/new')}
          variant="primary"
          style={styles.journalButton}
        />
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
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeRangeText: {
    fontSize: 14,
    color: colors.gray[700],
    marginRight: 4,
  },
  scoreCard: {
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  scoreDetails: {
    flex: 1,
  },
  scoreDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  scoreSubtext: {
    fontSize: 12,
    color: colors.gray[500],
  },
  chartCard: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  moodCard: {
    marginBottom: 16,
  },
  moodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  trendsCard: {
    marginBottom: 16,
  },
  trendsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  tipsCard: {
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  journalButton: {
    marginTop: 8,
  },
  noDataText: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
  },
});