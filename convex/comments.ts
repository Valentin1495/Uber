import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { getCurrentUserOrThrow } from './users';
import { paginationOptsValidator } from 'convex/server';
import { getImageUrls, getUserWithProfilePic } from './threads';

export const createComment = mutation({
  args: {
    text: v.string(),
    mediaFiles: v.optional(v.array(v.id('_storage'))),
    threadId: v.id('threads'),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const thread = await ctx.db.get(args.threadId);

    if (thread) {
      await ctx.db.patch(args.threadId, {
        commentCount: thread.commentCount + 1,
      });
    }

    const comment = await ctx.db.insert('comments', {
      ...args,
      authorId: user._id,
      createdAt: Date.now(),
    });

    return comment;
  },
});

export const getCommentsByPost = query({
  args: { threadId: v.id('threads'), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('comments')
      .withIndex('by_post', (q) => q.eq('threadId', args.threadId))
      .order('desc')
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      comments.page.map(async (c) => ({
        ...c,
        author: await getUserWithProfilePic(ctx, c.authorId),
        mediaFiles: c.mediaFiles ? await getImageUrls(ctx, c.mediaFiles) : [],
      }))
    );

    return {
      ...comments,
      page,
    };
  },
});
