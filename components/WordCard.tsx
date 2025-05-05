import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Word } from '@/types';
import { formatDate } from '@/services/wordService';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface WordCardProps {
  word: Word;
  showDate?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({ word, showDate = false }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Animated.View
      style={[styles.card, { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }]}
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(300)}
    >
      <View style={styles.header}>
        <Text
          style={[styles.wordText, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
        >
          {word.word}
        </Text>
        {showDate && (
          <Text
            style={[styles.dateText, { color: isDark ? '#BBBBBB' : '#666666' }]}
          >
            {formatDate(word.date)}
          </Text>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Definition</Text>
        <Text
          style={[
            styles.definitionText,
            { color: isDark ? '#E0E0E0' : '#333333' },
          ]}
        >
          {word.definition}
        </Text>

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Example</Text>
        <Text
          style={[
            styles.exampleText,
            { color: isDark ? '#CCCCCC' : '#555555' },
          ]}
        >
          "{word.example}"
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordText: {
    fontSize: 24,
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  content: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#6A5ACD',
    marginBottom: 4,
  },
  definitionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  exampleText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

export default WordCard;
