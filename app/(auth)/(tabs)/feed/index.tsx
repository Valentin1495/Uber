import { colors } from '@/colors';
import PostThread from '@/components/post-thread';
import Thread from '@/components/thread';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { usePaginatedQuery } from 'convex/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TAB_NAMES, useTabBar } from '../_layout';
import { NativeScrollEvent } from 'react-native';
import { useFocusEffect } from 'expo-router';

const Feed = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [queryKey, setQueryKey] = useState(0);
  const { loadMore, results } = usePaginatedQuery(
    api.threads.getThreads,
    {
      key: queryKey,
    },
    {
      initialNumItems: 5,
    }
  );

  const refreshThreads = () => {
    setRefreshing(true);
    setQueryKey((prev) => prev + 1);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const { updateOpacity, setActiveTab } = useTabBar();
  const scrollY = useRef(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const tabName = TAB_NAMES.FEED;

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      setActiveTab(tabName);

      // Return function is invoked whenever the route gets out of focus.
      return () => {
        setActiveTab(tabName);
      };
    }, [setActiveTab, tabName])
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    // Determine scroll direction
    const isScrollDown = currentScrollY > scrollY.current;

    if (isScrollDown !== isScrollingDown) {
      setIsScrollingDown(isScrollDown);
    }

    // Calculate opacity based on scroll position and direction
    // We'll use a threshold of 100 for the full effect
    const threshold = 100;
    const scrollDelta = Math.min(threshold, Math.abs(currentScrollY));

    let newOpacity;
    if (isScrollDown) {
      // When scrolling down, decrease opacity
      newOpacity = 1 - (scrollDelta / threshold) * 0.8; // Keep minimum opacity at 0.2
    } else {
      // When scrolling up, increase opacity
      newOpacity = 0.2 + (scrollDelta / threshold) * 0.8;
    }

    updateOpacity(tabName, newOpacity);
    scrollY.current = currentScrollY;
  };

  return (
    <SafeAreaView>
      <FlatList
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={results}
        renderItem={({ item }) => (
          <Thread thread={item as Doc<'threads'> & { author: Doc<'users'> }} />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.loading}>Loading...</Text>
        )}
        keyExtractor={(item) => item._id}
        onEndReached={() => loadMore(5)}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View>
            <Image
              source={require('@/assets/images/threads-logo-black.png')}
              style={styles.logo}
            />

            <PostThread />

            <View style={styles.separator} />
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshThreads} />
        }
      />
    </SafeAreaView>
  );
};
export default Feed;

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#000',
  },
  logo: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  loading: {
    alignSelf: 'center',
    fontSize: 16,
    marginVertical: 16,
    color: colors.border,
  },
});
