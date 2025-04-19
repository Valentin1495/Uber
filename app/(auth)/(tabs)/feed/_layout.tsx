import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

const FeedLayout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen
        name='profile/[id]'
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='[id]'
        options={{
          title: 'Thread',
          headerShadowVisible: false,
          headerRight: () => (
            <Ionicons name='notifications-outline' size={24} color={'#000'} />
          ),
          headerTintColor: '#000',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text>Back</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
};
export default FeedLayout;
