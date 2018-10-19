import knex from 'knex';
import bcrypt from 'bcrypt';

export interface User {
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  admin: boolean;
}

export interface SessionData {
  expiration: Date;
  username: string;
}

export interface AuthSession {
  username: string;
  firstName: string;
  lastName: string;
  admin: boolean;
}

export interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  approved: boolean;
  date: Date;
  imageId?: string;
}

const TEST_SESSIONS = {} as any;
const TEST_ACCOUNT = {
  firstName: 'Oliver',
  lastName: 'Bell',
  username: 'test',
  admin: true
};
const TEST_POSTS: Post[] = [];

const TEST_MODE = process.env.NODE_ENV === 'test';

const TEST_USERNAME = 'test';
const TEST_PASSWORD = 'test';

export async function getPassword(username: string): Promise<string | null> {
  if (TEST_MODE) {
    if (username === TEST_USERNAME) {
      return await bcrypt.hash(TEST_PASSWORD, 10);
    }
  }
  return null;
}

export async function saveSession(token: string, username: string) {
  if (TEST_MODE) {
    TEST_SESSIONS[token] = {
      username: username,
      token: token
    };
  }
}

export async function getSession(token: string): Promise<AuthSession | null> {
  if (TEST_MODE) {
    const session = TEST_SESSIONS[token];
    if (session) {
      return TEST_ACCOUNT;
    }
  }
  return null;
}

export async function storePost(post: Post) {
  if (TEST_MODE) {
    TEST_POSTS.push(post);
  }
}

export async function getPost(id: string) {
  if (TEST_MODE) {
    for (const post of TEST_POSTS) {
      if (post.id === id) {
        return post;
      }
    }
  }
}

export async function getPosts() {
  if (TEST_MODE) {
    return TEST_POSTS;
  }

  return [];
}

export function clearPosts() {
  if (TEST_MODE) {
    TEST_POSTS.length = 0;
  }
}
