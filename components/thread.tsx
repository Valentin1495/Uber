import { colors } from '@/colors';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useCurrentUser } from '@/hooks/use-current-user';
import { formatTime } from '@/utils/format-time';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
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
  const currentUserId = currentUser!._id;
  const {
    _creationTime,
    author,
    text,
    commentCount,
    likeCount,
    repostCount,
    mediaFiles,
    _id,
  } = thread;

  const isLiked = useQuery(api.likes.checkIfLiked, {
    userId: currentUserId,
    threadId: _id,
  });
  const [liked, setLiked] = useState(isLiked ?? false);
  const [likeCnt, setLikeCnt] = useState(likeCount);
  const likeThread = useMutation(api.likes.likeThread);
  const unlikeThread = useMutation(api.likes.unlikeThread);

  useEffect(() => {
    if (isLiked !== undefined) {
      setLiked(isLiked);
    }
  }, [isLiked]);

  const toggleLike = async () => {
    try {
      if (isLiked) {
        await unlikeThread({ userId: currentUserId, threadId: _id });
        setLiked(false);
        setLikeCnt((prev) => prev - 1);
      } else {
        await likeThread({ userId: currentUserId, threadId: _id });
        setLiked(true);
        setLikeCnt((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <View style={styles.threadContainer}>
      {author?.imageUrl && (
        <Image source={{ uri: author.imageUrl }} style={styles.avatar} />
      )}

      <View style={styles.thread}>
        <View style={styles.threadTop}>
          <Text style={styles.author}>
            {author?.first_name} {author?.last_name}
          </Text>

          <Text style={styles.time}>{formatTime(_creationTime)}</Text>
        </View>

        <Text style={styles.threadText}>{text}</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mediaFilesContainer}
        >
          {mediaFiles &&
            mediaFiles.map((mediaFile, idx) => (
              <Image
                source={{ uri: mediaFile }}
                style={styles.mediaFile}
                key={idx}
              />
            ))}
        </ScrollView>

        <View style={styles.actionBtns}>
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity onPress={toggleLike}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={24}
                color={liked ? 'red' : 'black'}
              />
            </TouchableOpacity>
            <Text>{likeCnt}</Text>
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
    marginBottom: 10,
  },
});
