import Profile from '@/components/profile';
import { Id } from '@/convex/_generated/dataModel';
import { useLocalSearchParams } from 'expo-router';

const ProfileScreen = () => {
  const { id } = useLocalSearchParams();

  return <Profile id={id as Id<'users'>} showBackButton />;
};
export default ProfileScreen;
