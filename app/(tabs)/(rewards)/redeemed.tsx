import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useRewardsStore } from '@/hooks/useRewardsStore';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { formatDate } from '@/utils/helpers';
import { Gift, Copy, Check } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function RedeemedRewardsScreen() {
  const { redeemedRewards, availableRewards } = useRewardsStore();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  
  const getRewardDetails = (rewardId: string) => {
    return availableRewards.find(r => r.id === rewardId);
  };
  
  const handleCopyCode = (code: string) => {
    if (Platform.OS === 'web') {
      // Web implementation
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopiedCode(code);
          setTimeout(() => setCopiedCode(null), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          Alert.alert('Error', 'Failed to copy code to clipboard');
        });
    } else {
      // Native implementation
      Clipboard.setString(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
      Alert.alert('Copied', 'Voucher code copied to clipboard');
    }
  };
  
  if (redeemedRewards.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="No Redeemed Vouchers"
          description="You haven't redeemed any rewards yet. Earn points by journaling and checking in daily."
          icon={<Gift size={32} color={colors.gray[400]} />}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={redeemedRewards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const reward = getRewardDetails(item.rewardId);
          if (!reward) return null;
          
          return (
            <Card style={styles.voucherCard}>
              <View style={styles.voucherHeader}>
                <Text style={styles.voucherTitle}>{reward.title}</Text>
                <Text style={styles.voucherDate}>
                  Redeemed on {formatDate(item.redeemedAt)}
                </Text>
              </View>
              
              <Text style={styles.voucherDescription}>
                {reward.description}
              </Text>
              
              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Voucher Code</Text>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{item.code}</Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => handleCopyCode(item.code)}
                  >
                    {copiedCode === item.code ? (
                      <Check size={18} color={colors.success} />
                    ) : (
                      <Copy size={18} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  voucherCard: {
    marginBottom: 16,
  },
  voucherHeader: {
    marginBottom: 8,
  },
  voucherTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  voucherDate: {
    fontSize: 12,
    color: colors.gray[500],
  },
  voucherDescription: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 16,
  },
  codeContainer: {
    marginTop: 8,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 8,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  codeText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  copyButton: {
    padding: 8,
  },
});