import * as db from './db/db';
import * as uuid from 'uuid';

export async function create(author: string, title: string, content: string): Promise<string> {
  const id = uuid.v1();
  const post: db.Post = {
    author: author,
    id: id,
    title: title,
    content: content,
    approved: false,
    pinned: false,
    date: new Date()
  };
  await db.storePost(post);
  return id;
}

export async function get(id: string) {
  return await db.getPost(id);
}

export async function getAll() {
  return await db.getPosts();
}

export async function clear() {
  return await db.clearPosts();
}

export async function approve(id: string): Promise<boolean> {
  return await db.setPostApproval(id, true);
}

export async function pin(id: string): Promise<boolean> {
  return await db.setPinned(id, true);
}

export async function unpin(id: string): Promise<boolean> {
  return await db.setPinned(id, false);
}
