import { colors } from '@/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#000',
        tabBarStyle: {
          ...styles.tabBar,
        },
      }}
    >
      <Tabs.Screen
        name='feed'
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='search/index'
        options={{
          title: 'Search',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='create'
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Ionicons name='add' size={size} color={color} />
            </View>
          ),
          headerShown: false,
        }}
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            // Handle tab press here
            router.push('/(auth)/(modal)/create?isModal=true');
          },
        }}
      />
      <Tabs.Screen
        name='favorites'
        options={{
          title: 'Favorites',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logOutText: {
    marginRight: 10,
    color: 'blue',
  },
  iconContainer: {
    backgroundColor: colors.itemBackground,
    borderRadius: 8,
    width: 32,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    height: 50,
    paddingTop: 6,
    backgroundColor: '#fff',
  },
  tabBarBackground: {
    position: 'absolute',
    inset: 0,
  },
  tabBarBackgroundItem: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#fff',
  },
});
