import { Tabs } from 'expo-router';
import { BookOpen, History } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6A5ACD', // Primary purple
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#888888' : '#999999',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
          borderTopColor: colorScheme === 'dark' ? '#333333' : '#EEEEEE',
        },
        tabBarLabelStyle: {
          fontWeight: '500',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
          borderBottomColor: colorScheme === 'dark' ? '#333333' : '#EEEEEE',
          borderBottomWidth: 1,
        },
        headerTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Word of the Day',
          tabBarLabel: 'Today',
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Word History',
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}