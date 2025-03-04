import { colors } from '@/colors';
import { Id } from '@/convex/_generated/dataModel';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import UserProfile from './user-profile';
import Tabs from './tabs';
type Props = {
  id: Id<'users'>;
  showBackButton: boolean;
};

const Profile = ({ id, showBackButton }: Props) => {
  const { userProfile } = useUserProfile();
  const { signOut } = useAuth();
  const router = useRouter();
  const tabList = ['Threads', 'Replies', 'Reposts'];

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        renderItem={({ item }) => null}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You haven't posted anything yet.</Text>
        }
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {showBackButton ? (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name='chevron-back' size={24} color={'#000'} />
                  <Text>back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name='web' size={24} color={'#000'} />
              )}

              <TouchableOpacity onPress={() => signOut()}>
                <Ionicons name='log-out-outline' size={24} color={'#000'} />
              </TouchableOpacity>
            </View>
            {id ? (
              <UserProfile id={id} />
            ) : (
              <UserProfile myProfile={userProfile} />
            )}

            <Tabs tabList={tabList} />
          </>
        }
      />
    </View>
  );
};
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 16,
    marginVertical: 16,
    color: colors.border,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});
