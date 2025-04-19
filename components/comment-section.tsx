import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { formatTime } from '@/utils/format-time';
import { Link } from 'expo-router';

interface CommentProps {
  _id: Id<'comments'>;
  text: string;
  mediaFiles?: (string | null)[];
  authorId: Id<'users'>;
  createdAt: number;
  updatedAt?: number;
}

const Comment = ({ comment }: { comment: CommentProps }) => {
  const { mediaFiles, text, createdAt, authorId } = comment;
  const author = useQuery(api.users.getUserById, { id: authorId });

  return (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Text style={styles.authorText}>
          {author?.first_name} {author?.last_name}
        </Text>
        <Text style={styles.timeText}>{formatTime(createdAt)}</Text>
      </View>
      <Text style={styles.commentText}>{text}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mediaFilesContainer}
      >
        {mediaFiles &&
          mediaFiles.map((mediaFile, idx) => {
            if (mediaFile === null) return null;
            return (
              <Link
                key={idx}
                href={{
                  pathname: '/(auth)/(modal)/image/[url]',
                  params: { url: mediaFile },
                }}
              >
                <Image source={{ uri: mediaFile }} style={styles.mediaFile} />
              </Link>
            );
          })}
      </ScrollView>
    </View>
  );
};

export function CommentSection({ threadId }: { threadId: Id<'threads'> }) {
  const {
    loadMore,
    results: comments,
    isLoading,
  } = usePaginatedQuery(
    api.comments.getCommentsByPost,
    {
      threadId,
    },
    {
      initialNumItems: 5,
    }
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>

      <FlatList
        scrollEventThrottle={16}
        data={comments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Comment comment={item} />
          </View>
        )}
        onEndReached={() => loadMore(5)}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <Text style={styles.noCommentsText}>
            No comments yet. Be the first to comment!
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  commentContainer: {
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  authorText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  timeText: {
    color: '#666',
    fontSize: 12,
  },
  commentText: {
    fontSize: 15,
    marginVertical: 4,
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    marginRight: 16,
  },
  actionText: {
    color: '#666',
    fontSize: 13,
  },
  deleteText: {
    color: '#cc0000',
  },
  replyingToContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  replyingToText: {
    fontSize: 13,
    color: '#0066cc',
    fontStyle: 'italic',
    marginRight: 8,
  },
  cancelReplyText: {
    fontSize: 13,
    color: '#cc0000',
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
