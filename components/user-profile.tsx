import { colors } from '@/colors';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { Link } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

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
  } | null;
  id?: Id<'users'>;
};
const UserProfile = ({ currentUser, id }: Props) => {
  let user;

  if (!id) {
    user = currentUser;
  } else {
    const anotherUser = useQuery(api.users.getUserById, {
      id,
    });
    user = id === currentUser?._id ? currentUser : anotherUser;
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
          {imageUrl && <Image source={{ uri: imageUrl }} style={styles.img} />}
        </View>

        <Text style={styles.bio}>{bio || 'No bio'}</Text>

        <Text>
          {followersCount} followers &middot; {websiteUrl || 'No website'}
        </Text>

        <View style={styles.btnContainer}>
          <Link
            href={`/(auth)/(modal)/edit-profile?imageUrl=${imageUrl}&bio=${bio ? encodeURIComponent(bio) : ''}&websiteUrl=${websiteUrl ? encodeURIComponent(websiteUrl) : ''}&id=${_id}`}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Edit Profile</Text>
          </Link>
          <Link href={'/'} style={styles.btn}>
            <Text style={styles.btnText}>Share Profile</Text>
          </Link>
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
