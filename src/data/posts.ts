import * as db from './db/db';
import * as uuid from 'uuid';

export async function create(author: string, title: string, content: string): Promise<string> {
  const id = uuid.v1();
  const post: db.Post = {
    author: author,
    id: id,
    title: title,
    content: content,
    date: new Date()
  };
  await db.storePost(post);
  return id;
}

export async function get(id: string) {
  return await db.getPost(id);
}
