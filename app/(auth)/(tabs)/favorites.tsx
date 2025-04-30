import { colors } from '@/colors';
import Thread from '@/components/thread';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useCurrentUser } from '@/hooks/use-current-user';
import { usePaginatedQuery } from 'convex/react';
import { Link } from 'expo-router';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Text,
} from 'react-native';

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

  return (
    <View
      style={[styles.container, isInitialLoading && styles.loadingContainer]}
    >
      {isInitialLoading ? (
        <ActivityIndicator size='large' />
      ) : (
        <FlatList
          data={results}
          renderItem={({ item, index }) => (
            <View
              style={{
                paddingBottom: index === results.length - 1 ? 36 : 0,
              }}
            >
              <Thread
                thread={item as Doc<'threads'> & { author: Doc<'users'> }}
              />
            </View>
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
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>
              You haven't liked any threads yet. Go to the Feed tab and like
              some threads to see them here.
            </Text>
          )}
        />
      )}
    </View>
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
  emptyText: {
    fontSize: 16,
    color: colors.border,
    paddingHorizontal: 16,
    fontStyle: 'italic',
  },
});
