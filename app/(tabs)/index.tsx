import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { Word } from '@/types';
import { fetchRandomWord, getWordHistory } from '@/services/wordService';
import WordCard from '@/components/WordCard';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function HomeScreen() {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const loadInitialWord = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if we have any words in history
      const history = await getWordHistory();

      if (history.length > 0) {
        // Use the most recent word from history
        setCurrentWord(history[0]);
      } else {
        // Fetch a new word if history is empty
        const word = await fetchRandomWord();
        setCurrentWord(word);
      }
    } catch (error) {
      console.error('Error loading initial word:', error);
      setError('Failed to load word. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const word = await fetchRandomWord();
      setCurrentWord(word);
    } catch (error) {
      console.error('Error refreshing word:', error);
      setError('Failed to get a new word. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadInitialWord();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDark ? '#121212' : '#F8F8F8' },
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A5ACD" />
          <Text
            style={[
              styles.loadingText,
              { color: isDark ? '#BBBBBB' : '#666666' },
            ]}
          >
            Loading word of the day...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#121212' : '#F8F8F8' },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={styles.headerContainer}
          entering={FadeIn.duration(800)}
        >
          <Text
            style={[styles.header, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
          >
            Word of the Day
          </Text>
          <Text
            style={[
              styles.subheader,
              { color: isDark ? '#BBBBBB' : '#666666' },
            ]}
          >
            Expand your vocabulary one word at a time
          </Text>
        </Animated.View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button
              title="Try Again"
              onPress={loadInitialWord}
              variant="primary"
            />
          </View>
        ) : currentWord ? (
          <WordCard word={currentWord} />
        ) : (
          <EmptyState
            title="No Words Yet"
            message="Tap the 'New Word' button to fetch your first word of the day!"
          />
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="New Word"
            onPress={handleRefresh}
            isLoading={isRefreshing}
            disabled={isRefreshing}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 24,
  },
  headerContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#C62828',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 24,
    marginHorizontal: 16,
  },
});
