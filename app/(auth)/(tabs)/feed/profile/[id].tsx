import Profile from '@/components/profile';
import { Id } from '@/convex/_generated/dataModel';
import { useLocalSearchParams } from 'expo-router';

const ProfilePage = () => {
  const { id } = useLocalSearchParams();

  return <Profile id={id as Id<'users'>} showBackButton />;
};
export default ProfilePage;
