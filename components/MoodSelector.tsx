import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mood } from '@/types';
import { colors, moodColors } from '@/constants/colors';
import { Smile, Laugh, Meh, Frown, AlertCircle } from 'lucide-react-native';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelectMood: (mood: Mood) => void;
}

const moods: { value: Mood; icon: React.ReactNode; label: string }[] = [
  { 
    value: 'joyful', 
    icon: <Laugh size={24} color={moodColors.joyful} />, 
    label: 'Joyful' 
  },
  { 
    value: 'happy', 
    icon: <Smile size={24} color={moodColors.happy} />, 
    label: 'Happy' 
  },
  { 
    value: 'neutral', 
    icon: <Meh size={24} color={moodColors.neutral} />, 
    label: 'Neutral' 
  },
  { 
    value: 'sad', 
    icon: <Frown size={24} color={moodColors.sad} />, 
    label: 'Sad' 
  },
  { 
    value: 'stressed', 
    icon: <AlertCircle size={24} color={moodColors.stressed} />, 
    label: 'Stressed' 
  },
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      
      <View style={styles.moodContainer}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.value}
            style={[
              styles.moodItem,
              selectedMood === mood.value && styles.selectedMood,
              selectedMood === mood.value && { borderColor: moodColors[mood.value] },
            ]}
            onPress={() => onSelectMood(mood.value)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              {mood.icon}
            </View>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.gray[100],
    width: 64,
  },
  selectedMood: {
    backgroundColor: colors.gray[200],
  },
  iconContainer: {
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: colors.gray[700],
    textAlign: 'center',
  },
});