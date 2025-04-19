import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from './Button';
import { colors } from '@/constants/colors';
import { CheckCheck } from 'lucide-react-native';

interface CheckInButtonProps {
  onCheckIn: () => void;
  isCheckedIn: boolean;
  isLoading?: boolean;
}

export const CheckInButton: React.FC<CheckInButtonProps> = ({
  onCheckIn,
  isCheckedIn,
  isLoading = false,
}) => {
  if (isCheckedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.checkedInContainer}>
          <CheckCheck size={20} color={colors.success} />
          <Text style={styles.checkedInText}>Checked in today</Text>
        </View>
        <Text style={styles.pointsText}>+10 points</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="Daily Check-In"
        onPress={onCheckIn}
        variant="primary"
        isLoading={isLoading}
        leftIcon={<CheckCheck size={18} color="white" />}
        style={styles.button}
      />
      <Text style={styles.pointsText}>+10 points</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
  checkedInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
  },
  checkedInText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[700],
    marginLeft: 8,
  },
  pointsText: {
    fontSize: 12,
    color: colors.gray[600],
    marginTop: 4,
  },
});