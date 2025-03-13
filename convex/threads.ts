import { convexToJson, v } from 'convex/values';
import { mutation, query, QueryCtx } from './_generated/server';
import { getCurrentUserOrThrow } from './users';
import { paginationOptsValidator } from 'convex/server';
import { Id } from './_generated/dataModel';

export const postThread = mutation({
  args: {
    text: v.string(),
    mediaFiles: v.optional(v.array(v.string())),
    websiteUrl: v.optional(v.string()),
    threadId: v.optional(v.id('threads')),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const thread = await ctx.db.insert('threads', {
      ...args,
      userId: user._id,
      likeCount: 0,
      commentCount: 0,
      repostCount: 0,
    });

    return thread;
  },
});

export const getThreads = query({
  args: {
    userId: v.optional(v.id('users')),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let threads;

    if (args.userId) {
      threads = await ctx.db
        .query('threads')
        .filter((q) => q.eq(q.field('userId'), args.userId))
        .order('desc')
        .paginate(args.paginationOpts);
    } else {
      threads = await ctx.db
        .query('threads')
        .order('desc')
        .paginate(args.paginationOpts);
    }

    const page = await Promise.all(
      threads.page.map(async (p) => ({
        ...p,
        author: await getUserWithProfilePic(ctx, p.userId),
      }))
    );

    return {
      ...threads,
      page,
    };
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  await getCurrentUserOrThrow(ctx);

  return await ctx.storage.generateUploadUrl();
});

export const getUserWithProfilePic = async (
  ctx: QueryCtx,
  userId: Id<'users'>
) => {
  const user = await ctx.db.get(userId);

  if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
    return user;
  }

  const imageUrl = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);

  return {
    ...user,
    imageUrl,
  };
};
