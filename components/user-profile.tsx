import { colors } from '@/colors';
import { Id } from '@/convex/_generated/dataModel';
import { Link } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  myProfile?: {
    _id: Id<'users'>;
    email: string;
    clerkId: string;
    imageUrl?: string;
    first_name?: string;
    last_name?: string;
    username: string | null;
    bio?: string;
    location?: string;
    websiteUrl?: string;
    followersCount: number;
    pushToken?: string;
  } | null;
  id?: string;
};
const UserProfile = ({ myProfile, id }: Props) => {
  if (myProfile) {
    const { email, imageUrl, username, bio, websiteUrl, followersCount, _id } =
      myProfile;

    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          <Image source={{ uri: imageUrl }} style={styles.img} />
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

  if (id) return <Text>User Profile {id}</Text>;
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
  username: {
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
