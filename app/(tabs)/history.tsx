import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Word } from '@/types';
import { getWordHistory, clearWordHistory } from '@/services/wordService';
import WordCard from '@/components/WordCard';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function HistoryScreen() {
  const [wordHistory, setWordHistory] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const history = await getWordHistory();
      setWordHistory(history);
    } catch (error) {
      console.error('Error loading word history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reload history whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear your word history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsClearing(true);
              await clearWordHistory();
              setWordHistory([]);
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert(
                'Error',
                'Failed to clear history. Please try again.'
              );
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

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
            Loading word history...
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
      <Animated.View
        style={styles.headerContainer}
        entering={FadeIn.duration(800)}
      >
        <Text
          style={[styles.header, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}
        >
          Word History
        </Text>
        <Text
          style={[styles.subheader, { color: isDark ? '#BBBBBB' : '#666666' }]}
        >
          Your collection of previously viewed words
        </Text>
      </Animated.View>

      {wordHistory.length > 0 ? (
        <>
          <FlatList
            data={wordHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <WordCard word={item} showDate={true} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Clear History"
              onPress={handleClearHistory}
              variant="danger"
              isLoading={isClearing}
              disabled={isClearing}
            />
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            title="No Word History"
            message="Your previously viewed words will appear here. Get started by viewing a new word of the day!"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    margin: 16,
    marginBottom: 8,
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
  listContent: {
    paddingTop: 8,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
});
