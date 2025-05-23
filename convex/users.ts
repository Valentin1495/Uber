import { v } from 'convex/values';
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from './_generated/server';
import { Id } from './_generated/dataModel';

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    username: v.union(v.string(), v.null()),
    bio: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    followersCount: v.number(),
    followingCount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert('users', {
      ...args,
      username: args.username || `${args.first_name} ${args.last_name}`,
    });
    return userId;
  },
});

export const getUserByClerkId = query({
  args: {
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter((u) => u.eq(u.field('clerkId'), args.clerkId))
      .unique();

    if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
      return user;
    }

    const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);

    return {
      ...user,
      imageUrl: url,
    };
  },
});

export const getUserById = query({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);

    if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
      return user;
    }

    const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);

    return {
      ...user,
      imageUrl: url,
    };
  },
});

export const searchUsers = query({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query('users')
      .withSearchIndex('searchUsers', (q) => q.search('username', args.text))
      .collect();

    const usersWithImageUrl = await Promise.all(
      users.map(async (user) => {
        if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
          return user;
        }

        const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);
        return {
          ...user,
          imageUrl: url,
        };
      })
    );

    return usersWithImageUrl;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  await getCurrentUserOrThrow(ctx);

  return await ctx.storage.generateUploadUrl();
});

export const updateImage = mutation({
  args: { storageId: v.id('_storage'), _id: v.id('users') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id, {
      imageUrl: args.storageId,
    });
  },
});

export const updateUserProfile = mutation({
  args: {
    _id: v.id('users'),
    bio: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    pushToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);

    const { _id, ...rest } = args;
    const updatedUser = await ctx.db.patch(_id, rest);
    return updatedUser;
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query('users')
    .withIndex('byClerkId', (q) => q.eq('clerkId', externalId))
    .unique();
}
