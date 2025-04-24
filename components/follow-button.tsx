import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useState } from 'react';
import { colors } from '@/colors';

interface FollowButtonProps {
  userId: Id<'users'>;
  width?: number;
}

export const FollowButton = ({ userId, width }: FollowButtonProps) => {
  // 팔로우 상태 조회
  const isFollowing = useQuery(api.follows.isFollowing, {
    targetUserId: userId,
  });

  // 팔로우/언팔로우 뮤테이션
  const followUser = useMutation(api.follows.followUser);
  const unfollowUser = useMutation(api.follows.unfollowUser);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFollow = async () => {
    try {
      setIsLoading(true);

      if (isFollowing) {
        await unfollowUser({ targetUserId: userId });
      } else {
        await followUser({ targetUserId: userId });
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 데이터 로딩 중
  if (isFollowing === undefined) {
    return (
      <TouchableOpacity style={styles.button} disabled>
        <ActivityIndicator size='small' color='#fff' />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFollowing && styles.followingButton,
        width ? { width } : { flex: 1 },
      ]}
      onPress={handleToggleFollow}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size='small' color={colors.border} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            isFollowing ? styles.followingText : styles.followText,
          ]}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.border,
  },
  followingButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  followText: {
    color: '#000',
  },
  followingText: {
    color: '#fff',
  },
});
