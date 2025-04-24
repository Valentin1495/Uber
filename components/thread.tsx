import { colors } from '@/colors';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useCurrentUser } from '@/hooks/use-current-user';
import { formatTime } from '@/utils/format-time';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { Link } from 'expo-router';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  thread: Doc<'threads'> & { author: Doc<'users'> };
};

const Thread = ({ thread }: Props) => {
  const currentUser = useCurrentUser();

  const currentUserId = currentUser?._id as Id<'users'>;
  const {
    _creationTime,
    author,
    text,
    commentCount,
    repostCount,
    mediaFiles,
    _id,
  } = thread;

  const isLiked = useQuery(api.likes.checkIfLiked, {
    userId: currentUserId,
    threadId: _id,
  });
  const likeCount = useQuery(api.likes.getLikeCount, { threadId: _id });

  const likeThread = useMutation(api.likes.likeThread).withOptimisticUpdate(
    (localStore, args) => {
      const { threadId, userId } = args;

      const currentIsLiked = localStore.getQuery(api.likes.checkIfLiked, {
        userId,
        threadId,
      });

      localStore.setQuery(
        api.likes.checkIfLiked,
        {
          userId,
          threadId,
        },
        !currentIsLiked
      );

      const currentLikeCount = localStore.getQuery(api.likes.getLikeCount, {
        threadId,
      }) as number;

      localStore.setQuery(
        api.likes.getLikeCount,
        {
          threadId,
        },
        currentLikeCount + 1
      );
    }
  );
  const unlikeThread = useMutation(api.likes.unlikeThread).withOptimisticUpdate(
    (localStore, args) => {
      const { threadId, userId } = args;

      const currentIsLiked = localStore.getQuery(api.likes.checkIfLiked, {
        userId,
        threadId,
      });

      localStore.setQuery(
        api.likes.checkIfLiked,
        {
          userId,
          threadId,
        },
        !currentIsLiked
      );

      const currentLikeCount = localStore.getQuery(api.likes.getLikeCount, {
        threadId,
      }) as number;

      localStore.setQuery(
        api.likes.getLikeCount,
        {
          threadId,
        },
        currentLikeCount - 1
      );
    }
  );

  const toggleLike = async () => {
    try {
      if (isLiked) {
        unlikeThread({ userId: currentUserId, threadId: _id });
      } else {
        likeThread({ userId: currentUserId, threadId: _id });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <View style={styles.threadContainer}>
      {author?.imageUrl && (
        <Link
          href={{
            pathname: '/(auth)/(tabs)/feed/profile/[id]',
            params: { id: author?._id },
          }}
          asChild
        >
          <TouchableOpacity>
            <Image source={{ uri: author.imageUrl }} style={styles.avatar} />
          </TouchableOpacity>
        </Link>
      )}

      <View style={styles.thread}>
        <View style={styles.threadTop}>
          <Text style={styles.author}>
            {author?.first_name} {author?.last_name}
          </Text>

          <Text style={styles.time}>{formatTime(_creationTime)}</Text>
        </View>

        {text && <Text style={styles.threadText}>{text}</Text>}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mediaFilesContainer}
        >
          {mediaFiles &&
            mediaFiles.map((mediaFile, idx) => (
              <Link
                key={idx}
                href={{
                  pathname: '/(auth)/(modal)/image/[url]', // 동적 경로
                  params: { url: mediaFile }, // mediaFile을 params로 전달
                }}
              >
                <Image source={{ uri: mediaFile }} style={styles.mediaFile} />
              </Link>
            ))}
        </ScrollView>

        <View style={styles.actionBtns}>
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity onPress={toggleLike}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={isLiked ? 'red' : 'black'}
              />
            </TouchableOpacity>
            <Text>{likeCount}</Text>
          </View>
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity>
              <Ionicons name='chatbubble-outline' size={24} />
            </TouchableOpacity>
            <Text>{commentCount}</Text>
          </View>
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity>
              <Ionicons name='repeat-outline' size={24} />
            </TouchableOpacity>
            <Text>{repostCount}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity>
        <Ionicons name='ellipsis-horizontal' color={colors.border} size={24} />
      </TouchableOpacity>
    </View>
  );
};
export default Thread;

const styles = StyleSheet.create({
  threadContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
  },
  thread: {
    flex: 1,
  },
  threadTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  threadText: {
    marginVertical: 10,
    fontSize: 16,
  },
  actionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  author: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  time: {
    color: colors.border,
    fontWeight: 'bold',
    fontSize: 12,
  },
  mediaFile: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  mediaFilesContainer: {
    gap: 10,
    marginVertical: 10,
  },
});
