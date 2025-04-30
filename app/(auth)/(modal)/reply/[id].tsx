import Thread from '@/components/thread';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import PostThread from '../create';

const ReplyModal = () => {
  const { id } = useLocalSearchParams();
  const thread = useQuery(api.threads.getThread, { id: id as Id<'threads'> });

  return (
    <View>
      {thread ? (
        <Thread thread={thread as Doc<'threads'> & { author: Doc<'users'> }} />
      ) : (
        <ActivityIndicator style={{ marginTop: 50 }} size={'large'} />
      )}

      <PostThread isReply threadId={id as Id<'threads'>} />
    </View>
  );
};
export default ReplyModal;
