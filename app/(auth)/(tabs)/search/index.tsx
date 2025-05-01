import { FollowButton } from '@/components/follow-button';
import SearchBar from '@/components/search-bar';
import { api } from '@/convex/_generated/api';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Search = () => {
  const currentUser = useCurrentUser();
  const [searchText, setSearchText] = useState('');
  const searchResults = useQuery(
    api.users.searchUsers,
    searchText.trim() === ''
      ? 'skip'
      : {
          text: searchText.trim(),
        }
  );

  return (
    <View style={styles.container}>
      <SearchBar searchText={searchText} setSearchText={setSearchText} />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.user}>
            <Link
              href={{
                pathname: '/feed/profile/[id]',
                params: { id: item._id },
              }}
              asChild
              style={{ flex: 1 }}
            >
              <TouchableOpacity style={styles.userInfo}>
                {item.imageUrl && (
                  <Image
                    source={item.imageUrl}
                    style={styles.profilePic}
                    contentFit='cover'
                    transition={1000}
                  />
                )}

                <View style={{ maxWidth: 200 }}>
                  <Text style={{ fontWeight: '700', fontSize: 18 }}>
                    {item.first_name} {item.last_name}
                  </Text>
                  <Text style={{ color: '#666', fontSize: 16 }}>
                    @{item.username}
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>

            {item._id !== currentUser?._id && (
              <FollowButton userId={item._id} width={100} />
            )}
          </View>
        )}
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
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: '#eee' }} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};
export default Search;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
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
});
