import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useSettingsStore } from '@/hooks/useSettingsStore';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useJournalStore } from '@/hooks/useJournalStore';
import { formatDate } from '@/utils/helpers';
import { 
  Key, 
  Users, 
  BookOpen, 
  LogOut, 
  ChevronRight,
  User,
  Calendar
} from 'lucide-react-native';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { openAiApiKey, setOpenAiApiKey } = useSettingsStore();
  const { logout, users } = useAuthStore();
  const { entries } = useJournalStore();
  
  const [apiKey, setApiKey] = useState(openAiApiKey || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveApiKey = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setOpenAiApiKey(apiKey);
      setIsSaving(false);
      Alert.alert('Success', 'OpenAI API key has been saved successfully.');
    }, 1000);
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };
  
  // Filter out admin user from the list
  const regularUsers = users.filter(user => !user.isAdmin);
  
  // Count total journal entries
  const totalEntries = entries.length;
  
  // Get today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  
  // Count entries created today
  const todayEntries = entries.filter(entry => 
    entry.date.startsWith(today)
  ).length;
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Admin Dashboard</Text>
        
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <Users size={20} color={colors.primary} />
              <Text style={styles.statTitle}>Users</Text>
            </View>
            <Text style={styles.statValue}>{regularUsers.length}</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <BookOpen size={20} color={colors.primary} />
              <Text style={styles.statTitle}>Entries</Text>
            </View>
            <Text style={styles.statValue}>{totalEntries}</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <View style={styles.statHeader}>
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.statTitle}>Today</Text>
            </View>
            <Text style={styles.statValue}>{todayEntries}</Text>
          </Card>
        </View>
        
        <Card style={styles.apiKeyCard}>
          <Text style={styles.cardTitle}>OpenAI API Key</Text>
          <Text style={styles.cardDescription}>
            Enter your OpenAI API key to enable journal analysis with your own account.
            If not provided, the app will use the Rork toolkit API.
          </Text>
          
          <Input
            placeholder="Enter OpenAI API key"
            value={apiKey}
            onChangeText={setApiKey}
            leftIcon={<Key size={20} color={colors.gray[400]} />}
            containerStyle={styles.apiKeyInput}
          />
          
          <Button
            title="Save API Key"
            onPress={handleSaveApiKey}
            variant="primary"
            isLoading={isSaving}
            disabled={!apiKey.trim()}
            style={styles.saveButton}
          />
        </Card>
        
        <Card style={styles.usersCard}>
          <Text style={styles.cardTitle}>Registered Users</Text>
          
          {regularUsers.length > 0 ? (
            <FlatList
              data={regularUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.userItem}
                  onPress={() => Alert.alert('User Details', `Name: ${item.name}\nEmail: ${item.email}\nPoints: ${item.points}\nStreak: ${item.streak}\nJoined: ${formatDate(item.joinedAt)}`)}
                >
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Text>
                  </View>
                  
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                  </View>
                  
                  <ChevronRight size={16} color={colors.gray[400]} />
                </TouchableOpacity>
              )}
              scrollEnabled={false}
              style={styles.usersList}
            />
          ) : (
            <Text style={styles.noUsersText}>No users registered yet</Text>
          )}
        </Card>
        
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          leftIcon={<LogOut size={18} color={colors.error} />}
          style={styles.logoutButton}
          textStyle={{ color: colors.error }}
        />
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    padding: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  apiKeyCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 16,
    lineHeight: 20,
  },
  apiKeyInput: {
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 8,
  },
  usersCard: {
    marginBottom: 24,
  },
  usersList: {
    marginTop: 8,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray[500],
  },
  noUsersText: {
    fontSize: 14,
    color: colors.gray[500],
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 8,
    borderColor: colors.error,
  },
});