import { Id } from '../convex/_generated/dataModel';
import { QueryCtx } from '../convex/_generated/server';

export const getUserByIdHelper = async (ctx: QueryCtx, id: Id<'users'>) => {
  const user = await ctx.db.get(id);

  if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
    return user;
  }

  const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);

  return {
    ...user,
    imageUrl: url,
  };
};
