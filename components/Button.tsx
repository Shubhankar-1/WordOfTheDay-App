import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  isLoading = false,
  disabled = false
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);
  
  const getBackgroundColor = () => {
    if (disabled) {
      return isDark ? '#555555' : '#CCCCCC';
    }
    
    switch (variant) {
      case 'primary':
        return '#6A5ACD'; // Primary purple
      case 'secondary':
        return isDark ? '#333333' : '#F0F0F0';
      case 'danger':
        return '#E53935'; // Red
      default:
        return '#6A5ACD';
    }
  };
  
  const getTextColor = () => {
    if (disabled) {
      return isDark ? '#999999' : '#888888';
    }
    
    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return isDark ? '#FFFFFF' : '#333333';
      case 'danger':
        return '#FFFFFF';
      default:
        return '#FFFFFF';
    }
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 200 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  return (
    <AnimatedTouchable
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        animatedStyle
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>
          {title}
        </Text>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  }
});

export default Button;