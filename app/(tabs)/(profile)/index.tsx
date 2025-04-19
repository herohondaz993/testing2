import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useJournalStore } from '@/hooks/useJournalStore';
import { useRewardsStore } from '@/hooks/useRewardsStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PointsDisplay } from '@/components/PointsDisplay';
import { StreakIndicator } from '@/components/StreakIndicator';
import { formatDate } from '@/utils/helpers';
import { 
  User, 
  LogOut, 
  BookOpen, 
  Gift, 
  Calendar, 
  Award, 
  HelpCircle, 
  Settings, 
  Shield,
  LayoutDashboard
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { getCurrentUser, logout, isAdmin } = useAuthStore();
  const { entries } = useJournalStore();
  const { getRedeemedRewards } = useRewardsStore();
  
  const user = getCurrentUser();
  
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
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notLoggedIn}>
          <Text style={styles.notLoggedInText}>
            You are not logged in
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Get user's journal entries
  const userEntries = entries.filter(entry => entry.userId === user.id);
  
  // Get user's redeemed rewards
  const redeemedRewards = getRedeemedRewards();
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profileJoined}>
              Joined {formatDate(user.joinedAt)}
            </Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <PointsDisplay points={user.points} />
          </View>
          <View style={styles.statsItem}>
            <StreakIndicator streak={user.streak} />
          </View>
        </View>
        
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Activity</Text>
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <BookOpen size={20} color={colors.primary} />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Journal Entries</Text>
              <Text style={styles.statValue}>{userEntries.length}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Gift size={20} color={colors.primary} />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Redeemed Rewards</Text>
              <Text style={styles.statValue}>{redeemedRewards.length}</Text>
            </View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Calendar size={20} color={colors.primary} />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Days Active</Text>
              <Text style={styles.statValue}>
                {Math.floor((new Date().getTime() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24)) + 1}
              </Text>
            </View>
          </View>
        </Card>
        
        <Card style={styles.menuCard}>
          <Text style={styles.menuTitle}>Settings</Text>
          
          {isAdmin && (
            <TouchableButton
              icon={<LayoutDashboard size={20} color={colors.gray[600]} />}
              label="Admin Dashboard"
              onPress={() => router.push('/(admin)/dashboard')}
            />
          )}
          
          <TouchableButton
            icon={<Settings size={20} color={colors.gray[600]} />}
            label="App Settings"
            onPress={() => Alert.alert('Settings', 'App settings would open here')}
          />
          
          <TouchableButton
            icon={<Shield size={20} color={colors.gray[600]} />}
            label="Privacy & Security"
            onPress={() => Alert.alert('Privacy', 'Privacy settings would open here')}
          />
          
          <TouchableButton
            icon={<HelpCircle size={20} color={colors.gray[600]} />}
            label="Help & Support"
            onPress={() => Alert.alert('Help', 'Help center would open here')}
          />
          
          <TouchableButton
            icon={<Award size={20} color={colors.gray[600]} />}
            label="About MindJournal"
            onPress={() => Alert.alert('About', 'About page would open here')}
            isLast
          />
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

interface TouchableButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}

const TouchableButton: React.FC<TouchableButtonProps> = ({
  icon,
  label,
  onPress,
  isLast = false,
}) => {
  return (
    <Button
      title={label}
      onPress={onPress}
      variant="ghost"
      leftIcon={icon}
      style={[
        styles.menuButton,
        isLast ? null : styles.menuButtonBorder,
      ]}
      textStyle={styles.menuButtonText}
    />
  );
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 4,
  },
  profileJoined: {
    fontSize: 12,
    color: colors.gray[500],
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  statsItem: {
    flex: 1,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray[600],
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  menuCard: {
    marginBottom: 24,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  menuButton: {
    justifyContent: 'flex-start',
    paddingVertical: 12,
  },
  menuButtonBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  menuButtonText: {
    color: colors.text,
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 8,
    borderColor: colors.error,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notLoggedInText: {
    fontSize: 16,
    color: colors.gray[600],
  },
});