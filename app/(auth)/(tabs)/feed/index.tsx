import { colors } from '@/colors';
import PostThread from '@/components/post-thread';
import Thread from '@/components/thread';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { usePaginatedQuery } from 'convex/react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Feed = () => {
  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.threads.getThreads,
    {},
    {
      initialNumItems: 8,
    }
  );

  return (
    <SafeAreaView>
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <Thread thread={item as Doc<'threads'> & { author: Doc<'users'> }} />
        )}
        keyExtractor={(item) => item._id}
        onEndReached={() => loadMore(8)}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View>
            <Image
              source={require('@/assets/images/threads-logo-black.png')}
              style={styles.logo}
            />

            <PostThread />
          </View>
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
});
