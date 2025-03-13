import { api } from '@/convex/_generated/api';
import { usePaginatedQuery } from 'convex/react';
import { View, Text, FlatList } from 'react-native';

const Feed = () => {
  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.threads.getThreads,
    {},
    {
      initialNumItems: 8,
    }
  );

  console.log(results);

  return (
    // <FlatList
    //   data={results}
    //   renderItem={({item}) => item.}
    // />
    null
  );
};
export default Feed;
