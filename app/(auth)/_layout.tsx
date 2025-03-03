import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: 'white' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name='(tabs)'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='(modal)/create'
        options={{
          presentation: 'modal',
          title: 'New thread',
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons
                name='ellipsis-horizontal-circle'
                size={24}
                color={'#000'}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
