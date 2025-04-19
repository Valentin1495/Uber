import { colors } from '@/colors';
import Thread from '@/components/thread';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useCurrentUser } from '@/hooks/use-current-user';
import { usePaginatedQuery } from 'convex/react';
import { Link } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TAB_NAMES } from './_layout';
import { useTabScrollHandler } from '@/hooks/use-tab-scroll-handler';
const Favorites = () => {
  const currentUser = useCurrentUser();
  const { _id } = currentUser || {};
  const { isLoading, results, loadMore, status } = usePaginatedQuery(
    api.likes.getLikedThreads,
    { userId: _id as Id<'users'> },
    {
      initialNumItems: 5,
    }
  );
  const isLoadingMore = status === 'LoadingMore';
  const isInitialLoading = isLoading && results.length === 0;
  const { handleScroll } = useTabScrollHandler(TAB_NAMES.FAVORITES);

  return (
    <SafeAreaView
      style={[styles.container, isInitialLoading && styles.loadingContainer]}
    >
      {isInitialLoading ? (
        <ActivityIndicator size='large' />
      ) : (
        <FlatList
          onScroll={handleScroll}
          scrollEventThrottle={16}
          data={results}
          renderItem={({ item, index }) => (
            <Link
              href={{
                pathname: '/feed/[id]',
                params: { id: item._id },
              }}
              style={{
                paddingBottom: index === results.length - 1 ? 36 : 0,
              }}
            >
              <Thread
                thread={item as Doc<'threads'> & { author: Doc<'users'> }}
              />
            </Link>
          )}
          keyExtractor={(item) => item._id}
          onEndReached={() => {
            if (!isLoadingMore) loadMore(5);
          }}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size='small' style={{ marginVertical: 16 }} />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};
export default Favorites;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
