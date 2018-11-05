import * as db from './db/db';
import * as uuid from 'uuid';

export interface PostsQuery {
  approved?: string | boolean;
  page?: number;
  limit?: number;
}

export async function create(
  author: string,
  title: string,
  content: string,
  numImages: number
): Promise<string> {
  const id = uuid.v1();
  const post: db.Post = {
    author: author,
    id: id,
    title: title,
    content: content,
    numImages: numImages,
    approved: false,
    pinned: false,
    date: new Date()
  };
  await db.storePost(post);
  return id;
}

export async function remove(id: string): Promise<boolean> {
  return await db.removePost(id);
}

export async function get(id: string): Promise<db.Post | null> {
  return await db.getPost(id);
}

export async function getAll(query: PostsQuery = {}): Promise<db.Post[]> {
  return await db.getPosts(
    query.approved !== undefined && query.approved.toString() === 'false' ?
      false :
      true,
    query.page,
    query.limit
  );
}

export async function clear() {
  return await db.clearPosts();
}

export async function setApproval(id: string, approval: boolean): Promise<boolean> {
  return await db.setPostApproval(id, approval);
}

export async function setPinned(id: string, pinned: boolean): Promise<boolean> {
  return await db.setPinned(id, pinned);
}
