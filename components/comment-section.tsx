import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { formatTime } from '@/utils/format-time';
import { Link } from 'expo-router';
import { Image } from 'expo-image';

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
      {author?.imageUrl && (
        <Image
          source={author.imageUrl}
          style={styles.avatar}
          contentFit='cover'
          transition={1000}
        />
      )}

      <View style={{ flex: 1 }}>
        <View style={styles.commentHeader}>
          <Text style={styles.authorText}>
            {author?.first_name} {author?.last_name}
          </Text>

          <Text style={styles.timeText}>{formatTime(createdAt)}</Text>
        </View>

        {text && <Text style={styles.commentText}>{text}</Text>}

        {mediaFiles && mediaFiles.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaFilesContainer}
          >
            {mediaFiles.map((mediaFile, idx) => {
              if (mediaFile === null) return null;
              return (
                <Link
                  key={idx}
                  href={{
                    pathname: '/(auth)/(modal)/image/[url]',
                    params: { url: mediaFile },
                  }}
                >
                  <Image
                    source={mediaFile}
                    style={styles.mediaFile}
                    contentFit='cover'
                    transition={1000}
                  />
                </Link>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export function CommentSection({ threadId }: { threadId: Id<'threads'> }) {
  const {
    loadMore,
    results: comments,
    isLoading,
    status,
  } = usePaginatedQuery(
    api.comments.getCommentsByPost,
    {
      threadId,
    },
    {
      initialNumItems: 5,
    }
  );

  const isLoadingMore = status === 'LoadingMore';
  const commentsCount = comments.length;
  const isInitialLoading = isLoading && commentsCount === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}
      </Text>

      {isInitialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' />
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Comment comment={item} />}
          onEndReached={() => {
            if (!isLoadingMore) loadMore(5);
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => (
            <Text style={styles.noCommentsText}>
              No comments yet. Be the first to comment!
            </Text>
          )}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size='small' style={{ marginVertical: 16 }} />
            ) : null
          }
        />
      )}
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
    flexDirection: 'row',
    gap: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginTop: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
