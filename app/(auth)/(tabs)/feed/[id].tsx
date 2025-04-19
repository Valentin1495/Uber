import { colors } from '@/colors';
import { CommentSection } from '@/components/comment-section';
import Thread from '@/components/thread';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useQuery } from 'convex/react';
import { Link, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ThreadPage = () => {
  const { id } = useLocalSearchParams();
  const thread = useQuery(api.threads.getThread, { id: id as Id<'threads'> });
  const currentUser = useCurrentUser();

  return (
    <View style={styles.container}>
      {thread ? (
        <Thread thread={thread as Doc<'threads'> & { author: Doc<'users'> }} />
      ) : (
        <ActivityIndicator style={{ marginTop: 50 }} size={'large'} />
      )}

      <CommentSection threadId={id as Id<'threads'>} />

      <View style={styles.separator} />

      <Link
        href={{
          pathname: '/(auth)/(modal)/reply/[id]',
          params: { id: id as Id<'threads'> },
        }}
        style={styles.replyButtonContainer}
        asChild
      >
        <TouchableOpacity style={styles.replyButton}>
          {currentUser?.imageUrl && (
            <Image
              source={{ uri: currentUser.imageUrl }}
              style={styles.profilePic}
            />
          )}
          <Text>Reply to this thread</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};
export default ThreadPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 52,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#000',
    marginTop: 'auto',
  },
  replyButtonContainer: {
    marginTop: 8,
    marginHorizontal: 8,
  },
  replyButton: {
    backgroundColor: colors.itemBackground,
    padding: 8,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 9999,
  },
  noCommentsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  repliesContainer: {
    marginLeft: 20,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
