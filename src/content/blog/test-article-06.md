---
title: "GraphQL API設計ガイド"
description: "GraphQLを使用したAPI設計の基本原則から実践的な実装方法まで、包括的に解説します。"
pubDate: 2024-01-15
heroImage: "/images/graphql-api.jpg"
tags: ["GraphQL", "API", "バックエンド", "設計"]
category: "バックエンド"
draft: false
---

# GraphQL API設計ガイド

GraphQLは、RESTの制約を解決し、効率的なデータフェッチを可能にするクエリ言語です。

## スキーマ設計

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
  published: Boolean!
}

type Comment {
  id: ID!
  content: String!
  author: User!
  post: Post!
}
```

## クエリの実装

```javascript
const typeDefs = gql`
  type Query {
    users: [User!]!
    user(id: ID!): User
    posts(limit: Int, offset: Int): [Post!]!
    post(id: ID!): Post
  }
  
  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    users: () => userService.getAllUsers(),
    user: (_, { id }) => userService.getUserById(id),
    posts: (_, { limit, offset }) => postService.getPosts(limit, offset),
    post: (_, { id }) => postService.getPostById(id),
  },
  
  Mutation: {
    createUser: (_, { input }) => userService.createUser(input),
    updateUser: (_, { id, input }) => userService.updateUser(id, input),
    deleteUser: (_, { id }) => userService.deleteUser(id),
  },
};
```

## N+1問題の解決

```javascript
const DataLoader = require('dataloader');

const userLoader = new DataLoader(async (userIds) => {
  const users = await userService.getUsersByIds(userIds);
  return userIds.map(id => users.find(user => user.id === id));
});

const resolvers = {
  Post: {
    author: (post) => userLoader.load(post.authorId),
  },
  
  Comment: {
    author: (comment) => userLoader.load(comment.authorId),
  },
};
```

## エラーハンドリング

```javascript
const { GraphQLError } = require('graphql');

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      try {
        const user = await userService.getUserById(id);
        if (!user) {
          throw new GraphQLError('User not found', {
            extensions: { code: 'USER_NOT_FOUND' }
          });
        }
        return user;
      } catch (error) {
        throw new GraphQLError('Failed to fetch user', {
          extensions: { code: 'INTERNAL_ERROR' }
        });
      }
    },
  },
};
```

## 認証・認可

```javascript
const jwt = require('jsonwebtoken');

const context = ({ req }) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  let user = null;
  
  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // Token invalid
    }
  }
  
  return { user };
};

const resolvers = {
  Mutation: {
    createPost: (_, { input }, { user }) => {
      if (!user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      
      return postService.createPost({ ...input, authorId: user.id });
    },
  },
};
```

## ページネーション

```graphql
type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
}

type PostEdge {
  node: Post!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  posts(first: Int, after: String): PostConnection!
}
```

## サブスクリプション

```javascript
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const typeDefs = gql`
  type Subscription {
    postAdded: Post!
    commentAdded(postId: ID!): Comment!
  }
`;

const resolvers = {
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator(['POST_ADDED']),
    },
    commentAdded: {
      subscribe: (_, { postId }) => 
        pubsub.asyncIterator([`COMMENT_ADDED_${postId}`]),
    },
  },
  
  Mutation: {
    createPost: async (_, { input }) => {
      const post = await postService.createPost(input);
      pubsub.publish('POST_ADDED', { postAdded: post });
      return post;
    },
  },
};
```

GraphQLを適切に活用することで、効率的で保守性の高いAPIを構築できます。 