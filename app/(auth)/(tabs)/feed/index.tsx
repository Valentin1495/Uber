import { colors } from '@/colors';
import PostThread from '@/components/post-thread';
import Thread from '@/components/thread';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { usePaginatedQuery } from 'convex/react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Feed = () => {
  const { loadMore, results, isLoading, status } = usePaginatedQuery(
    api.threads.getThreads,
    {},
    {
      initialNumItems: 5,
    }
  );

  const isLoadingMore = status === 'LoadingMore';
  const isInitialLoading = isLoading && results.length === 0;

  return (
    <SafeAreaView style={isInitialLoading && styles.loadingContainer}>
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
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (!isLoadingMore) loadMore(5);
          }}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
