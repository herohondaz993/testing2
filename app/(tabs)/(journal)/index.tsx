import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { useJournalStore } from '@/hooks/useJournalStore';
import { useAuthStore } from '@/hooks/useAuthStore';
import { JournalCard } from '@/components/JournalCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import { BookOpen, PenLine, Calendar } from 'lucide-react-native';

export default function JournalScreen() {
  const { entries } = useJournalStore();
  const { getCurrentUser } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'week' | 'month'>('all');
  
  const user = getCurrentUser();
  
  // Get user's journal entries
  const userEntries = entries.filter(entry => entry.userId === user?.id);
  
  const filteredEntries = () => {
    const now = new Date();
    
    if (selectedFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return userEntries.filter(entry => new Date(entry.date) >= weekAgo);
    }
    
    if (selectedFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      return userEntries.filter(entry => new Date(entry.date) >= monthAgo);
    }
    
    return userEntries;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'all' && styles.filterTextActive
            ]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'week' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('week')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'week' && styles.filterTextActive
            ]}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'month' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('month')}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === 'month' && styles.filterTextActive
            ]}>Month</Text>
          </TouchableOpacity>
        </View>
        
        <Button
          title="New Entry"
          onPress={() => router.push('/(tabs)/(journal)/new')}
          variant="primary"
          size="small"
          leftIcon={<PenLine size={16} color="white" />}
        />
      </View>
      
      {userEntries.length === 0 ? (
        <EmptyState
          title="No Journal Entries Yet"
          description="Start journaling to track your thoughts and feelings."
          icon={<BookOpen size={32} color={colors.gray[400]} />}
          actionLabel="Write First Entry"
          onAction={() => router.push('/(tabs)/(journal)/new')}
        />
      ) : (
        <FlatList
          data={filteredEntries()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JournalCard
              entry={item}
              onPress={() => router.push(`/(tabs)/(journal)/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="No Entries in This Period"
              description="Try selecting a different time period or create a new entry."
              icon={<Calendar size={32} color={colors.gray[400]} />}
            />
          }
        />
      )}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: colors.background,
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[500],
  },
  filterTextActive: {
    color: colors.primary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
});