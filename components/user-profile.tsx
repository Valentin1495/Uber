import { colors } from '@/colors';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FollowButton } from './follow-button';
import { Image } from 'expo-image';

type Props = {
  currentUser: {
    _id: Id<'users'>;
    email: string;
    imageUrl?: string | null;
    first_name?: string;
    last_name?: string;
    bio?: string;
    websiteUrl?: string;
    followersCount: number;
    followingCount: number;
  } | null;
  id?: Id<'users'>;
};
const UserProfile = ({ currentUser, id }: Props) => {
  let user;
  const isCurrentUser = id === currentUser?._id;

  if (!id) {
    user = currentUser;
  } else {
    const anotherUser = useQuery(api.users.getUserById, {
      id,
    });
    user = isCurrentUser ? currentUser : anotherUser;
  }

  if (user) {
    const {
      _id,
      email,
      imageUrl,
      first_name,
      last_name,
      bio,
      websiteUrl,
      followersCount,
      followingCount,
    } = user;

    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <View>
            <Text style={styles.name}>
              {first_name} {last_name}
            </Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          {imageUrl && (
            <Image
              source={imageUrl}
              style={styles.img}
              contentFit='cover'
              transition={1000}
            />
          )}
        </View>

        <Text style={styles.bio}>{bio || 'No bio'}</Text>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Link
            href={{
              pathname: '/(auth)/follower-list/[id]',
              params: { id: _id },
            }}
            asChild
          >
            <TouchableOpacity>
              <Text>
                {followersCount}{' '}
                {followersCount === 1 ? 'follower' : 'followers'}
              </Text>
            </TouchableOpacity>
          </Link>
          <Link
            href={{
              pathname: '/(auth)/following-list/[id]',
              params: { id: _id },
            }}
            asChild
          >
            <TouchableOpacity>
              <Text>{followingCount} following</Text>
            </TouchableOpacity>
          </Link>
          <Text>&middot;</Text>
          <Text> {websiteUrl || 'No website'}</Text>
        </View>

        <View style={styles.btnContainer}>
          {isCurrentUser || id === undefined ? (
            <Link
              href={`/(auth)/(modal)/edit-profile?imageUrl=${imageUrl}&bio=${bio ? encodeURIComponent(bio) : ''}&websiteUrl=${websiteUrl ? encodeURIComponent(websiteUrl) : ''}&id=${_id}`}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Edit Profile</Text>
            </Link>
          ) : (
            <FollowButton userId={_id} />
          )}
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Share Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};
export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#777',
  },
  bio: {
    fontSize: 14,
    marginVertical: 16,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 16,
    marginTop: 16,
  },
  btn: {
    padding: 10,
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
