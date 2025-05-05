import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { BookX } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface EmptyStateProps {
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(600).delay(300)}
    >
      <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333333' : '#F0F0F0' }]}>
        <BookX size={40} color="#6A5ACD" strokeWidth={1.5} />
      </View>
      <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: isDark ? '#BBBBBB' : '#666666' }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 24,
  }
});

export default EmptyState;