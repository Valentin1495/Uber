import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function AuthLayout() {
  const router = useRouter();

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
      <Stack.Screen
        name='(modal)/image/[url]'
        options={{
          presentation: 'fullScreenModal',
          title: '',
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons
                name='ellipsis-horizontal-circle'
                size={24}
                color={'#000'}
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Ionicons name='close' size={24} color={'#000'} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name='(modal)/reply/[id]'
        options={{
          presentation: 'modal',
          title: 'Reply',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name='(modal)/edit-profile'
        options={{
          presentation: 'modal',
          title: 'Edit Profile',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
}
