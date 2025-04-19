import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const User = {
  email: v.string(),
  clerkId: v.string(),
  imageUrl: v.optional(v.string()),
  first_name: v.optional(v.string()),
  last_name: v.optional(v.string()),
  username: v.union(v.string(), v.null()),
  bio: v.optional(v.string()),
  location: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  followersCount: v.number(),
  pushToken: v.optional(v.string()),
};

export const Thread = {
  userId: v.id('users'), // Foreign key to users table
  threadId: v.optional(v.string()),
  text: v.string(),
  likeCount: v.number(), // Default value 0
  commentCount: v.number(), // Default value 0
  repostCount: v.number(), // Default value 0
  mediaFiles: v.optional(v.array(v.string())), // Array of media file URLs
  websiteUrl: v.optional(v.string()), // Optional website URL
};

export const Like = {
  userId: v.id('users'), // Foreign key to users table
  threadId: v.id('threads'), // Foreign key to threads table
};

export const Comments = {
  text: v.string(),
  mediaFiles: v.optional(v.array(v.string())),
  authorId: v.id('users'),
  threadId: v.string(),
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
};

export default defineSchema({
  users: defineTable(User)
    .index('byClerkId', ['clerkId'])
    .searchIndex('searchUsers', {
      searchField: 'username',
    }),
  threads: defineTable(Thread),
  likes: defineTable(Like).index('byUserAndThread', ['userId', 'threadId']), // 중복 좋아요 방지
  comments: defineTable(Comments)
    .index('by_post', ['threadId'])
    .index('by_author', ['authorId']),
});
