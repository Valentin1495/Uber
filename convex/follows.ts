import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { getCurrentUserOrThrow, getUserById } from './users';
import { paginationOptsValidator } from 'convex/server';
import { getUserByIdHelper } from '../utils/get-user-by-id-helper';

export const followUser = mutation({
  args: {
    targetUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // 인증 확인 & 현재 사용자 ID 가져오기
    const currentUser = await getCurrentUserOrThrow(ctx);

    // 팔로우 대상 사용자 확인
    const targetUser = await ctx.db.get(args.targetUserId);
    if (!targetUser) {
      throw new Error('Target user not found');
    }

    // 자기 자신을 팔로우할 수 없음
    if (currentUser._id === args.targetUserId) {
      throw new Error('Cannot follow yourself');
    }

    // 이미 팔로우 중인지 확인
    const existingFollow = await ctx.db
      .query('follows')
      .withIndex('byFollowerAndFollowing', (q) =>
        q.eq('followerId', currentUser._id).eq('followingId', args.targetUserId)
      )
      .first();

    if (existingFollow) {
      throw new Error('Already following this user');
    }

    // 팔로우 관계 생성
    const followId = await ctx.db.insert('follows', {
      followerId: currentUser._id,
      followingId: args.targetUserId,
      createdAt: Date.now(),
    });

    // 팔로우 당한 사용자의 팔로워 수 업데이트
    await ctx.db.patch(args.targetUserId, {
      followersCount: targetUser.followersCount + 1,
    });

    // 팔로우한 사용자의 팔로잉 수 업데이트 (추가된 부분)
    await ctx.db.patch(currentUser._id, {
      followingCount: currentUser.followingCount + 1,
    });

    return { success: true, followId };
  },
});

export const unfollowUser = mutation({
  args: {
    targetUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // 인증 확인 & 현재 사용자 ID 가져오기
    const currentUser = await getCurrentUserOrThrow(ctx);

    const targetUser = await ctx.db.get(args.targetUserId);
    if (!targetUser) {
      throw new Error('Target user not found');
    }

    // 팔로우 관계 찾기
    const follow = await ctx.db
      .query('follows')
      .withIndex('byFollowerAndFollowing', (q) =>
        q.eq('followerId', currentUser._id).eq('followingId', args.targetUserId)
      )
      .first();

    if (!follow) {
      throw new Error('Not following this user');
    }

    // 팔로우 관계 삭제
    await ctx.db.delete(follow._id);

    // 팔로우 당한 사용자의 팔로워 수 업데이트
    await ctx.db.patch(args.targetUserId, {
      followersCount: targetUser.followersCount - 1,
    });

    // 팔로우한 사용자의 팔로잉 수 업데이트 (추가된 부분)
    await ctx.db.patch(currentUser._id, {
      followingCount: currentUser.followingCount - 1,
    });

    return { success: true };
  },
});

// 팔로우 상태 확인하기
export const isFollowing = query({
  args: {
    targetUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    // 인증 확인
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    // 현재 사용자 ID 가져오기
    const currentUser = await ctx.db
      .query('users')
      .withIndex('byClerkId', (q) => q.eq('clerkId', identity.subject))
      .first();

    if (!currentUser) {
      return false;
    }

    // 팔로우 관계 확인
    const follow = await ctx.db
      .query('follows')
      .withIndex('byFollowerAndFollowing', (q) =>
        q.eq('followerId', currentUser._id).eq('followingId', args.targetUserId)
      )
      .first();

    return !!follow;
  },
});

// 팔로워 목록 가져오기 (특정 사용자를 팔로우하는 사람들)
export const getFollowers = query({
  args: {
    userId: v.id('users'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query('follows')
      .withIndex('byFollowing', (q) => q.eq('followingId', args.userId))
      .order('desc')
      .paginate(args.paginationOpts);

    const page = await Promise.all(
      follows.page.map(async (follow) => {
        const follower = await getUserByIdHelper(ctx, follow.followerId);

        return {
          ...follow,
          follower,
        };
      })
    );

    return {
      ...follows,
      page,
    };
  },
});

// 팔로잉 목록 가져오기 (특정 사용자가 팔로우하는 사람들)
export const getFollowing = query({
  args: {
    userId: v.id('users'),
    limit: v.optional(v.number()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query('follows')
      .withIndex('byFollower', (q) => q.eq('followerId', args.userId))
      .order('desc')
      .paginate(args.paginationOpts);

    // 팔로잉 사용자 정보 가져오기
    const page = await Promise.all(
      follows.page.map(async (follow) => {
        const followedUser = await getUserByIdHelper(ctx, follow.followingId);

        return {
          ...follow,
          followedUser,
        };
      })
    );

    return {
      ...follows,
      page,
    };
  },
});
