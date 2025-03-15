import { colors } from '@/colors';
import { Doc } from '@/convex/_generated/dataModel';
import { formatTime } from '@/utils/format-time';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  thread: Doc<'threads'> & { author: Doc<'users'> };
};

const Thread = ({ thread }: Props) => {
  const {
    _creationTime,
    _id,
    author,
    text,
    commentCount,
    likeCount,
    repostCount,
    mediaFiles,
  } = thread;

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

        <View style={styles.actionBtns}>
          <View style={styles.actionBtnContainer}>
            <TouchableOpacity>
              <Ionicons name='heart-outline' size={24} />
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
});
