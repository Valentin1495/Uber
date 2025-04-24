import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';

export const useCurrentUser = () => {
  const { user } = useUser();
  const clerkId = user?.id;
  const currentUser = useQuery(api.users.getUserByClerkId, { clerkId });

  if (currentUser) {
    const {
      _id,
      email,
      imageUrl,
      bio,
      websiteUrl,
      followersCount,
      followingCount,
      first_name,
      last_name,
    } = currentUser;

    return {
      _id,
      email,
      imageUrl,
      first_name,
      last_name,
      bio,
      websiteUrl,
      followersCount,
      followingCount,
    };
  }

  return null;
};
