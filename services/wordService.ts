import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word } from '@/types';

const STORAGE_KEY = 'word_history';
const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// List of fallback words in case the API fails
const fallbackWords = [
  {
    word: 'serendipity',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way',
    example: 'Her unexpected job offer was a perfect example of serendipity.'
  },
  {
    word: 'ephemeral',
    definition: 'Lasting for a very short time',
    example: 'The ephemeral beauty of cherry blossoms only lasts a few days.'
  },
  {
    word: 'ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    example: 'Mobile phones have become ubiquitous in modern society.'
  },
  {
    word: 'eloquent',
    definition: 'Fluent or persuasive in speaking or writing',
    example: 'Her eloquent speech moved the entire audience.'
  },
  {
    word: 'resilience',
    definition: 'The capacity to recover quickly from difficulties; toughness',
    example: 'The resilience of the human spirit is remarkable in times of crisis.'
  },
  {
    word: 'mellifluous',
    definition: 'Sweet or musical; pleasant to hear',
    example: 'The singer had a mellifluous voice that captivated the audience.'
  },
  {
    word: 'quintessential',
    definition: 'Representing the most perfect or typical example of a quality or class',
    example: 'The small café is the quintessential Parisian dining experience.'
  },
  {
    word: 'surreptitious',
    definition: 'Kept secret, especially because it would not be approved of',
    example: 'He took a surreptitious glance at his watch during the meeting.'
  }
];

// Generate a random word from a fallback list
const getRandomFallbackWord = (): Word => {
  const randomIndex = Math.floor(Math.random() * fallbackWords.length);
  const wordData = fallbackWords[randomIndex];
  return {
    id: Date.now().toString(),
    ...wordData,
    date: new Date().toISOString()
  };
};

// Get a list of 1000 common English words to fetch random words
const commonWords = [
  'time', 'year', 'people', 'way', 'day', 'man', 'thing', 'woman', 'life', 'child', 
  'world', 'school', 'state', 'family', 'student', 'group', 'country', 'problem', 'hand', 
  'part', 'place', 'case', 'week', 'company', 'system', 'program', 'question', 'work', 
  'government', 'number', 'night', 'point', 'home', 'water', 'room', 'mother', 'area', 
  'money', 'story', 'fact', 'month', 'lot', 'right', 'study', 'book', 'eye', 'job', 
  'word', 'business', 'issue', 'side', 'kind', 'head', 'house', 'service', 'friend', 
  'father', 'power', 'hour', 'game', 'line', 'end', 'member', 'law', 'car', 'city', 
  'community', 'name', 'president', 'team', 'minute', 'idea', 'kid', 'body', 'back', 
  'parent', 'face', 'others', 'level', 'office', 'door', 'health', 'person', 'art', 
  'war', 'history', 'party', 'result', 'change', 'morning', 'reason', 'research', 'girl', 
  'guy', 'moment', 'air', 'teacher', 'force', 'education'
];

// Get a random word to fetch from the API
const getRandomWordToFetch = (): string => {
  const randomIndex = Math.floor(Math.random() * commonWords.length);
  return commonWords[randomIndex];
};

// Fetch a random word from the API
export const fetchRandomWord = async (): Promise<Word> => {
  try {
    const wordToFetch = getRandomWordToFetch();
    const response = await fetch(`${API_URL}${wordToFetch}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch word');
    }
    
    const data = await response.json();
    
    if (!data || !data[0] || !data[0].meanings || !data[0].meanings[0]) {
      throw new Error('Invalid data structure');
    }
    
    const wordData = data[0];
    const meaning = wordData.meanings[0];
    const definition = meaning.definitions[0]?.definition || 'No definition available';
    const example = meaning.definitions[0]?.example || 'No example available';
    
    const word: Word = {
      id: Date.now().toString(),
      word: wordData.word,
      definition: definition,
      example: example,
      date: new Date().toISOString()
    };
    
    // Save the word to history
    await saveWordToHistory(word);
    
    return word;
  } catch (error) {
    console.error('Error fetching word:', error);
    // Return a fallback word if the API fails
    const fallbackWord = getRandomFallbackWord();
    await saveWordToHistory(fallbackWord);
    return fallbackWord;
  }
};

// Save a word to the history
export const saveWordToHistory = async (word: Word): Promise<void> => {
  try {
    const history = await getWordHistory();
    history.unshift(word); // Add to the beginning of the array
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving word to history:', error);
  }
};

// Get the word history
export const getWordHistory = async (): Promise<Word[]> => {
  try {
    const historyJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (historyJson) {
      return JSON.parse(historyJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting word history:', error);
    return [];
  }
};

// Clear the word history
export const clearWordHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing word history:', error);
  }
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};