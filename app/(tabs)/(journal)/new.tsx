import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useJournalStore } from '@/hooks/useJournalStore';
import { useUserStore } from '@/hooks/useUserStore';
import { MoodSelector } from '@/components/MoodSelector';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Mood } from '@/types';
import { analyzeJournalEntry } from '@/utils/ai';
import { X, Plus } from 'lucide-react-native';

export default function NewJournalScreen() {
  const router = useRouter();
  const { addEntry } = useJournalStore();
  const { addPoints } = useUserStore();
  
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write something in your journal.');
      return;
    }
    
    if (!mood) {
      Alert.alert('Error', 'Please select your mood.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the journal entry
      const entry = addEntry(content.trim(), mood, tags);
      
      // Analyze the entry with AI
      const analysis = await analyzeJournalEntry(content);
      
      if (analysis) {
        // Update the entry with the analysis
        useJournalStore.getState().updateEntry(entry.id, { analysis });
      }
      
      // Award points for creating a journal entry
      addPoints(20);
      
      // Navigate back to the journal list
      router.push('/(tabs)/(journal)');
      
      // Show success message
      Alert.alert(
        'Journal Entry Saved',
        'Your entry has been saved and you earned 20 points!'
      );
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert(
        'Error',
        'There was an error saving your journal entry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.prompt}>
            How are you feeling today? Write down your thoughts, experiences, or anything on your mind.
          </Text>
          
          <TextInput
            style={styles.journalInput}
            multiline
            placeholder="Start writing here..."
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
            autoFocus
          />
          
          <MoodSelector
            selectedMood={mood}
            onSelectMood={setMood}
          />
          
          <View style={styles.tagsSection}>
            <Text style={styles.tagsLabel}>Add Tags (optional)</Text>
            
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add a tag"
                value={newTag}
                onChangeText={setNewTag}
                onSubmitEditing={handleAddTag}
              />
              <TouchableOpacity 
                style={styles.addTagButton}
                onPress={handleAddTag}
              >
                <Plus size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveTag(index)}
                      style={styles.removeTagButton}
                    >
                      <X size={14} color={colors.gray[500]} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="outline"
              style={styles.cancelButton}
              disabled={isSubmitting}
            />
            <Button
              title="Save Entry"
              onPress={handleSubmit}
              variant="primary"
              isLoading={isSubmitting}
              style={styles.saveButton}
              disabled={!content.trim() || !mood}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  prompt: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 16,
    lineHeight: 24,
  },
  journalInput: {
    minHeight: 200,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginBottom: 24,
    lineHeight: 24,
  },
  tagsSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  tagsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: 8,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  addTagButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: colors.gray[700],
    marginRight: 4,
  },
  removeTagButton: {
    padding: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});