import { colors } from '@/colors';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import UserProfile from './user-profile';
import Tabs from './tabs';
import Thread from './thread';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TAB_NAMES, useTabBar } from '@/app/(auth)/(tabs)/_layout';
import { NativeSyntheticEvent } from 'react-native';
import { NativeScrollEvent } from 'react-native';

type Props = {
  id: Id<'users'>;
  showBackButton: boolean;
};

const Profile = ({ id, showBackButton }: Props) => {
  const currentUser = useCurrentUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const tabList = ['Threads', 'Replies', 'Reposts'];
  const [refreshing, setRefreshing] = useState(false);
  const [queryKey, setQueryKey] = useState(0); // ⭐ 쿼리 키를 위한 상태

  const { isLoading, loadMore, results } = usePaginatedQuery(
    api.threads.getThreads,
    {
      userId: id,
      key: queryKey, // 🔄 쿼리 키가 변경되면 리로드됨
    },

    { initialNumItems: 5 }
  );

  const refreshThreads = () => {
    setRefreshing(true);
    setQueryKey((prev) => prev + 1); // refreshKey 변경 → usePaginatedQuery 재실행
    setTimeout(() => setRefreshing(false), 2000); // UI에서 로딩 표시
  };

  const { updateOpacity, setActiveTab } = useTabBar();
  const scrollY = useRef(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const tabName = TAB_NAMES.PROFILE;

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
    <View style={styles.container}>
      <FlatList
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={results}
        renderItem={({ item }) => (
          <Thread thread={item as Doc<'threads'> & { author: Doc<'users'> }} />
        )}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isLoading || refreshing
              ? 'Loading...'
              : "You haven't posted anything yet."}
          </Text>
        }
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {showBackButton ? (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name='chevron-back' size={24} color={'#000'} />
                  <Text>back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name='web' size={24} color={'#000'} />
              )}

              <TouchableOpacity onPress={() => signOut()}>
                <Ionicons name='log-out-outline' size={24} color={'#000'} />
              </TouchableOpacity>
            </View>

            {id ? (
              <UserProfile id={id} />
            ) : (
              <UserProfile currentUser={currentUser} />
            )}

            <Tabs tabList={tabList} />
          </>
        }
        onEndReached={() => loadMore(5)}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshThreads} />
        }
      />
    </View>
  );
};
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 16,
    marginVertical: 16,
    color: colors.border,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#000',
  },
});
