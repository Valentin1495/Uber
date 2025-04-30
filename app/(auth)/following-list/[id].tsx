import { colors } from '@/colors';
import { FollowButton } from '@/components/follow-button';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCurrentUser } from '@/hooks/use-current-user';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const FollowingListScreen = () => {
  const { id } = useLocalSearchParams<{ id: Id<'users'> }>();
  const user = useQuery(api.users.getUserById, {
    id,
  });
  const { isLoading, loadMore, results, status } = usePaginatedQuery(
    api.follows.getFollowing,
    { userId: id },
    {
      initialNumItems: 5,
    }
  );
  const isLoadingMore = status === 'LoadingMore';
  const isInitialLoading = isLoading && results.length === 0;
  const router = useRouter();
  const currentUser = useCurrentUser();

  return (
    <View>
      <Stack.Screen
        name='following-list/[id]'
        options={{
          title: `Users followed by ${user?.first_name}`,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text>Back</Text>
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
        }}
      />

      {isInitialLoading ? (
        <ActivityIndicator size='large' />
      ) : (
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <View style={styles.user}>
              <Link
                href={{
                  pathname: '/feed/profile/[id]',
                  params: { id: item.followedUser?._id as Id<'users'> },
                }}
                asChild
                style={{
                  flex: 1,
                }}
              >
                <TouchableOpacity style={styles.userInfo}>
                  {item.followedUser?.imageUrl && (
                    <Image
                      source={{ uri: item.followedUser.imageUrl }}
                      style={styles.profilePic}
                    />
                  )}

                  <View style={{ maxWidth: 200 }}>
                    <Text style={{ fontWeight: '700', fontSize: 18 }}>
                      {item.followedUser?.first_name}{' '}
                      {item.followedUser?.last_name}
                    </Text>
                    <Text style={{ color: '#666', fontSize: 16 }}>
                      @{item.followedUser?.username}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Link>

              {currentUser?._id !== item.followedUser?._id && (
                <FollowButton
                  userId={item.followedUser?._id as Id<'users'>}
                  width={100}
                />
              )}
            </View>
          )}
          keyExtractor={(item) => item._id}
          onEndReached={() => {
            if (!isLoadingMore) loadMore(5);
          }}
          ListEmptyComponent={() => (
            <View style={{ padding: 20 }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#999',
                  fontSize: 16,
                  fontStyle: 'italic',
                }}
              >
                No users found
              </Text>
            </View>
          )}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size='small' style={{ marginVertical: 16 }} />
            ) : null
          }
        />
      )}
    </View>
  );
};
export default FollowingListScreen;

const styles = StyleSheet.create({
  user: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  followButton: {
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    borderColor: colors.border,
  },
  buttonText: {
    fontWeight: 600,
    color: colors.submit,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#000',
  },
});
