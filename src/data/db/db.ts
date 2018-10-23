import knex from 'knex';
import bcrypt from 'bcrypt';
import uuidParse from 'uuid-parse';

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
  pinned: boolean;
}

const TEST_SQLITE_FILE = './testdb.db';
const TEST_MODE = process.env.NODE_ENV === 'test';

const TEST_USERNAME = 'test';
const TEST_PASSWORD = 'test';

const TABLE_USERS = 'users';
const TABLE_SESSIONS = 'sessions';
const TABLE_POSTS = 'posts';

const pgConnectionConfig = {
  host: process.env.PG_HOST || 'localhost',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'example',
  database: process.env.PG_DB || 'test',
};

let db: knex;

function convertUuid(id: string) {
  return Buffer.from(uuidParse.parse(id));
}

async function generateUsersTable() {
  if (!await db.schema.hasTable(TABLE_USERS)) {
    await db.schema.createTable(TABLE_USERS, (table) => {
      table.string('username');
      table.string('password');
      table.string('firstName');
      table.string('lastName');
      table.boolean('admin');
      table.primary(['username']);
    });
  }
}

async function generateSessionsTable() {
  if (!await db.schema.hasTable(TABLE_SESSIONS)) {
    await db.schema.createTable(TABLE_SESSIONS, (table) => {
      table.binary('token');
      table.string('username');
      table.dateTime('expiration');
      table.primary(['token']);
    });
  }
}

async function generatePostsTable() {
  if (!await db.schema.hasTable(TABLE_POSTS)) {
    await db.schema.createTable(TABLE_POSTS, (table) => {
      table.binary('id');
      table.string('author');
      table.dateTime('date');
      table.string('title');
      table.string('content');
      table.boolean('approved');
      table.boolean('pinned');
    });
  }
}

export async function initDb() {
  if (TEST_MODE) {
    db = knex({
      client: 'sqlite',
      connection: {
        filename: TEST_SQLITE_FILE,
      },
      useNullAsDefault: true
    });
    // await db.schema.dropTableIfExists(TABLE_USERS);
    // await db.schema.dropTableIfExists(TABLE_SESSIONS);
  } else {
    db = knex({
      client: 'pg',
      connection: pgConnectionConfig
    });
  }

  await generateUsersTable();

  if (TEST_MODE) {
    try {
      await db.insert({
        username: TEST_USERNAME,
        password: await bcrypt.hash(TEST_PASSWORD, 10),
        firstName: 'test',
        lastName: 'test',
        admin: true
      }).into('users');
    } catch (e) {}
  }
  await generateSessionsTable();
  await generatePostsTable();
}

export async function getDetails(username: string): Promise<User | null> {
  if (!db) {
    await initDb();
  }
  const detailsRow = await db.select().from(TABLE_USERS).where('username', username).first();
  if (!detailsRow) {
    return null;
  }

  return {
    passwordHash: detailsRow['password'],
    username: detailsRow['username'],
    firstName: detailsRow['firstName'],
    lastName: detailsRow['lastName'],
    admin: detailsRow['admin']
  };
}

export async function storeSession(token: string, username: string, expiration: Date) {
  if (!db) {
    await initDb();
  }
  const binToken = convertUuid(token);

  try {
    await db.insert({
      username: username,
      expiration: expiration,
      token: binToken
    }).into(TABLE_SESSIONS);
  } catch (e) {
    await db.update({
      username: username,
      expiration: expiration
    }).table(TABLE_SESSIONS).where('token', binToken);
  }
}

export async function getSession(token: string): Promise<SessionData | null> {
  if (!db) {
    await initDb();
  }
  const sessionData = await db.select(['username', 'expiration'])
                              .from(TABLE_SESSIONS)
                              .where('token', convertUuid(token))
                              .first();
  if (sessionData) {
    return sessionData as SessionData;
  }

  return null;
}

export async function storePost(post: Post) {
  if (!db) {
    await initDb();
  }
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

export async function getPost(id: string): Promise<Post | null> {
  if (!db) {
    await initDb();
  }
  const postData = await db.select().from(TABLE_POSTS).where('id', convertUuid(id)).first();

  if (postData) {
    postData['id'] = uuidParse.unparse(postData['id']);
    postData['date'] = new Date(postData['date']);
    return postData;
  }

  return null;
}

export async function getPosts() {
  if (!db) {
    await initDb();
  }
  const postsData = await db.select().from(TABLE_POSTS);

  for (const postData of postsData) {
    postData['id'] = uuidParse.unparse(postData['id']);
    postData['date'] = new Date(postData['date']);
  }

  return postsData;
}

export async function clearPosts() {
  if (!db) {
    await initDb();
  }
  await db.delete().from(TABLE_POSTS);
}

export async function setPostApproval(id: string, approved: boolean) {
  if (!db) {
    await initDb();
  }

  if (!await getPost(id)) {
    return false;
  }
  await db.update({ approved: approved })
          .table(TABLE_POSTS)
          .where('id', convertUuid(id));

  return true;
}

export async function setPinned(id: string, pinned: boolean) {
  if (!db) {
    await initDb();
  }

  if (!await getPost(id)) {
    return false;
  }

  await db.update({ pinned: pinned })
          .table(TABLE_POSTS)
          .where('id', convertUuid(id));
  return true;
}
