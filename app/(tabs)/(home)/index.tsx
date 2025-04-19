import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useUserStore } from '@/hooks/useUserStore';
import { useJournalStore } from '@/hooks/useJournalStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { StreakIndicator } from '@/components/StreakIndicator';
import { PointsDisplay } from '@/components/PointsDisplay';
import { CheckInButton } from '@/components/CheckInButton';
import { JournalCard } from '@/components/JournalCard';
import { EmptyState } from '@/components/EmptyState';
import { BookOpen, PenLine, ChevronRight } from 'lucide-react-native';

export default function HomeScreen() {
  const { getCurrentUser, isAdmin } = useAuthStore();
  const { checkIn } = useUserStore();
  const { entries } = useJournalStore();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  
  const user = getCurrentUser();
  
  // If user is admin, redirect to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      // Use setTimeout to avoid navigation during initial render
      const timer = setTimeout(() => {
        router.replace('/(admin)/dashboard');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAdmin]);
  
  const handleCheckIn = () => {
    setIsCheckingIn(true);
    setTimeout(() => {
      const success = checkIn();
      setIsCheckingIn(false);
      
      if (success) {
        Alert.alert('Check-in successful!', 'You earned 10 points.');
      } else {
        Alert.alert('Already checked in', 'You already checked in today.');
      }
    }, 1000);
  };
  
  const isCheckedInToday = () => {
    if (!user || !user.lastCheckIn) return false;
    
    const today = new Date().toISOString().split('T')[0];
    return user.lastCheckIn.startsWith(today);
  };
  
  // Get user's journal entries
  const userEntries = entries.filter(entry => entry.userId === user?.id);
  const recentEntries = userEntries.slice(0, 2);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {user && (
          <>
            <Text style={styles.greeting}>Hello, {user.name.split(' ')[0]}</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statsItem}>
                <PointsDisplay points={user.points} />
              </View>
              <View style={styles.statsItem}>
                <StreakIndicator streak={user.streak} />
              </View>
            </View>
            
            <Card style={styles.checkInCard}>
              <Text style={styles.sectionTitle}>Daily Check-In</Text>
              <CheckInButton 
                onCheckIn={handleCheckIn} 
                isCheckedIn={isCheckedInToday()}
                isLoading={isCheckingIn}
              />
            </Card>
            
            <View style={styles.journalSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Journal</Text>
                <Button
                  title="New Entry"
                  onPress={() => router.push('/(tabs)/(journal)/new')}
                  variant="outline"
                  size="small"
                  leftIcon={<PenLine size={16} color={colors.primary} />}
                />
              </View>
              
              {recentEntries.length > 0 ? (
                <>
                  {recentEntries.map((entry) => (
                    <JournalCard
                      key={entry.id}
                      entry={entry}
                      onPress={() => router.push(`/(tabs)/(journal)/${entry.id}`)}
                    />
                  ))}
                  
                  <Button
                    title="View All Entries"
                    onPress={() => router.push('/(tabs)/(journal)')}
                    variant="ghost"
                    rightIcon={<ChevronRight size={16} color={colors.primary} />}
                    style={styles.viewAllButton}
                  />
                </>
              ) : (
                <EmptyState
                  title="No Journal Entries Yet"
                  description="Start journaling to track your thoughts and feelings."
                  icon={<BookOpen size={32} color={colors.gray[400]} />}
                  actionLabel="Write First Entry"
                  onAction={() => router.push('/(tabs)/(journal)/new')}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  statsItem: {
    flex: 1,
  },
  checkInCard: {
    marginBottom: 24,
  },
  journalSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  viewAllButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
});