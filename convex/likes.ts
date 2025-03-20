import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// ✅ Like a thread
export const likeThread = mutation({
  args: { userId: v.id('users'), threadId: v.id('threads') },
  async handler(ctx, { userId, threadId }) {
    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await ctx.db
      .query('likes')
      .withIndex('byUserAndThread', (q) =>
        q.eq('userId', userId).eq('threadId', threadId)
      )
      .first();

    if (existingLike) {
      throw new Error('Already liked this thread');
    }

    // 좋아요 추가
    await ctx.db.insert('likes', { userId, threadId });

    // likeCount 증가
    const thread = await ctx.db.get(threadId);
    if (thread) {
      await ctx.db.patch(threadId, { likeCount: thread.likeCount + 1 });
    }
  },
});

// ✅ Unlike a thread
export const unlikeThread = mutation({
  args: { userId: v.id('users'), threadId: v.id('threads') },
  async handler(ctx, { userId, threadId }) {
    // 좋아요 여부 확인
    const like = await ctx.db
      .query('likes')
      .withIndex('byUserAndThread', (q) =>
        q.eq('userId', userId).eq('threadId', threadId)
      )
      .first();

    if (!like) {
      throw new Error('Like not found');
    }

    // 좋아요 삭제
    await ctx.db.delete(like._id);

    // likeCount 감소
    const thread = await ctx.db.get(threadId);
    if (thread) {
      await ctx.db.patch(threadId, {
        likeCount: Math.max(0, thread.likeCount - 1),
      });
    }
  },
});

export const checkIfLiked = query({
  args: { userId: v.id('users'), threadId: v.id('threads') },
  async handler(ctx, { userId, threadId }) {
    const like = await ctx.db
      .query('likes')
      .withIndex('byUserAndThread', (q) =>
        q.eq('userId', userId).eq('threadId', threadId)
      )
      .first();

    return like ? true : false;
  },
});

export const getLikeCount = query({
  args: { threadId: v.id('threads') },
  async handler(ctx, { threadId }) {
    const thread = await ctx.db.get(threadId);
    return thread?.likeCount || 0;
  },
});
