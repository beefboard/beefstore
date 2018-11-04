import knex from 'knex';
import uuidParse from 'uuid-parse';

export interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  numImages: number;
  approved: boolean;
  date: Date;
  pinned: boolean;
}

export const TABLE_POSTS = 'posts';

const pgConnectionConfig = {
  host: process.env.PG_HOST || 'localhost',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'example',
  database: process.env.PG_DB || 'test',
};

export let db: knex;

function convertUuid(id: string) {
  return Buffer.from(uuidParse.parse(id));
}

async function generatePostsTable() {
  if (!await db.schema.hasTable(TABLE_POSTS)) {
    await db.schema.createTable(TABLE_POSTS, (table) => {
      table.binary('id');
      table.string('author');
      table.dateTime('date');
      table.integer('numImages');
      table.string('title');
      table.string('content');
      table.boolean('approved');
      table.boolean('pinned');
    });
  }
}

export async function initDb() {
  if (process.env.NODE_ENV === 'test') {
    db = knex({
      client: 'sqlite3',
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
      pool: { min: 0, max: 1 }
    });
  } else {
    db = knex({
      client: 'pg',
      connection: pgConnectionConfig
    });
  }
  await generatePostsTable();
}

export async function storePost(post: Post) {
  await db.insert({
    id: convertUuid(post.id),
    author: post.author,
    title: post.title,
    content: post.content,
    approved: post.approved,
    date: post.date,
    pinned: post.pinned
  }).into(TABLE_POSTS);
}

export async function removePost(id: string) {
  return (
    await db.delete().from(TABLE_POSTS).where('id', convertUuid(id))
  ) > 0;
}

export async function getPost(id: string): Promise<Post | null> {
  const postData = await db.select().from(TABLE_POSTS).where('id', convertUuid(id)).first();

  if (postData) {
    postData['id'] = uuidParse.unparse(postData['id']);
    postData['date'] = new Date(postData['date']);
    return postData;
  }

  return null;
}

export async function getPosts(approved: boolean, page?: number, limit: number = Infinity) {
  const postsData = await db.select().from(TABLE_POSTS).where('approved', approved);

  for (const postData of postsData) {
    postData['id'] = uuidParse.unparse(postData['id']);
    postData['date'] = new Date(postData['date']);
  }

  return postsData;
}

export async function clearPosts() {
  await db.delete().from(TABLE_POSTS);
}

export async function setPostApproval(id: string, approved: boolean) {
  return (
    await db
      .update({ approved: approved })
      .table(TABLE_POSTS)
      .where('id', convertUuid(id))
  ) > 0;
}

export async function setPinned(id: string, pinned: boolean) {
  return (
    await db
      .update({ pinned: pinned })
      .table(TABLE_POSTS)
      .where('id', convertUuid(id))
  ) > 0;
}
