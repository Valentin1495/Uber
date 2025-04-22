import { colors } from '@/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { createContext, useContext, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

export const TAB_NAMES = {
  FEED: 'feed/index',
  SEARCH: 'search/index',
  CREATE: 'create',
  FAVORITES: 'favorites',
  PROFILE: 'profile',
};

// Create a context to share the opacity value across components
export const TabBarContext = createContext({
  opacities: {} as Record<string, Animated.Value>,
  updateOpacity: (tabName: string, value: number) => {},
  activeTab: '',
  setActiveTab: (tabName: string) => {},
});

export const useTabBar = () => useContext(TabBarContext);

export default function TabsLayout() {
  const router = useRouter();
  // Initialize opacity values for each tab
  const [opacities] = useState({
    [TAB_NAMES.FEED]: new Animated.Value(1),
    [TAB_NAMES.SEARCH]: new Animated.Value(1),
    [TAB_NAMES.CREATE]: new Animated.Value(1),
    [TAB_NAMES.FAVORITES]: new Animated.Value(1),
    [TAB_NAMES.PROFILE]: new Animated.Value(1),
  });

  const [activeTab, setActiveTab] = useState(TAB_NAMES.FEED);

  const updateOpacity = (tabName: string, value: number) => {
    // Only update opacity for the active tab
    if (tabName === activeTab && opacities[tabName]) {
      // Ensure the opacity is between 0.2 and 1
      const clampedValue = Math.max(0.2, Math.min(1, value));
      Animated.timing(opacities[tabName], {
        toValue: clampedValue,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  // Custom tab bar component that handles individual tab opacities
  const TabBarBackground = () => {
    return (
      <View style={styles.tabBarBackground}>
        {Object.entries(opacities).map(([tabName, opacity]) => (
          <Animated.View
            key={tabName}
            style={[
              styles.tabBarBackgroundItem,
              {
                opacity,
                // Only show the active tab's background
                display: tabName === activeTab ? 'flex' : 'none',
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <TabBarContext.Provider
      value={{ opacities, updateOpacity, activeTab, setActiveTab }}
    >
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#000',
          tabBarStyle: {
            ...styles.tabBar,
          },
          tabBarBackground: () => <TabBarBackground />,
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
              router.push('/(auth)/(modal)/create');
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
    </TabBarContext.Provider>
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
    backgroundColor: 'transparent',
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
