import * as posts from './posts';
import { Post, initDb } from './db/db';

beforeAll(async () => {
  await initDb();
});

beforeEach(async () => {
  await posts.clear();
});

describe('creation', () => {
  it('should return post id', async () => {
    expect.assertions(1);
    const id = await posts.create('test', 'test title', 'This is the content of the post', 2);
    expect(id).not.toBeNull();
  });

  it('should generate unique post id\'s', async () => {
    expect.assertions(1);
    const id1 = await posts.create('test', 'test title', 'This is the content of the post', 2);
    const id2 = await posts.create('test', 'test title', 'This is the content of the post', 3);
    expect(id1).not.toBe(id2);
  });
});

describe('retreival', () => {
  it('should return posts by post id', async () => {
    expect.assertions(3);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test',
      numImages: 0
    };
    const id = await posts.create(post.author, post.title, post.content, post.numImages);

    const storedPost = await posts.get(id) as Post;
    expect(storedPost.title).toBe(post.title);
    expect(storedPost.author).toBe(post.author);
    expect(storedPost.content).toBe(storedPost.content);
  });

  it('should return null for non existent posts', async () => {
    expect.assertions(1);

    const post = await posts.get('bad-token');
    expect(post).toBeFalsy();
  });

  it('should return creation date of posts', async () => {
    expect.assertions(1);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test',
      numImages: 0
    };
    const id = await posts.create(post.author, post.title, post.content, post.numImages);

    const storedPost = await posts.get(id) as Post;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const storedPostDay = new Date(storedPost.date);
    storedPostDay.setHours(0, 0, 0, 0);

    expect(storedPostDay).toEqual(today);
  });

  it('should provide a list of posts', async () => {
    expect.assertions(1);

    const numPosts = 10;

    for (let i = 0; i < numPosts; i += 1) {
      const post = {
        title: 'test title',
        author: 'test',
        content: 'test',
        numImages: 0
      };
      const id = await posts.create(post.author, post.title, post.content, post.numImages);
    }

    const allPosts = await posts.getAll({ approved: false });
    expect(allPosts.length).toBe(numPosts);
  });

  it('should allow unapproved posts to be filtered', async () => {
    expect.assertions(2);
    const postId = await posts.create('test', 'test', 'test', 0);

    const allPosts = await posts.getAll({ approved: true });
    expect(allPosts.length).toBe(0);

    await posts.setApproval(postId, true);

    const allPosts2 = await posts.getAll({ approved: true });
    expect(allPosts2.length).toBe(1);
  });

  it('should filter unapproved posts by default', async () => {
    expect.assertions(1);

    const numPosts = 10;

    for (let i = 0; i < numPosts; i += 1) {
      const post = {
        title: 'test title',
        author: 'test',
        content: 'test',
        numImages: 0
      };
      const id = await posts.create(post.author, post.title, post.content, post.numImages);
    }

    const allPosts = await posts.getAll();
    expect(allPosts.length).toBe(0);
  });
});

describe('approval', () => {
  test('new posts should not be approved', async () => {
    expect.assertions(1);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test',
      numImages: 0
    };
    const id = await posts.create(post.author, post.title, post.content, post.numImages);
    const storedPost = await posts.get(id) as Post;

    expect(storedPost.approved).not.toBeTruthy();
  });

  it('should allow new posts to be approved', async () => {
    expect.assertions(1);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test',
      numImages: 0
    };
    const id = await posts.create(post.author, post.title, post.content, post.numImages);
    await posts.setApproval(id, true);

    const storedPost = await posts.get(id) as Post;
    expect(storedPost.approved).toBeTruthy();
  });

  it('should return false for invalid posts', async () => {
    expect.assertions(1);

    const successful = await posts.setApproval('asdfjasdf', true);

    expect(successful).toBeFalsy();
  });

});

describe('pinning', async () => {
  test('posts should not be pinned by default', async () => {
    expect.assertions(1);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test',
      numImages: 0
    };
    const id = await posts.create(post.author, post.title, post.content, post.numImages);

    const storedPost = await posts.get(id) as Post;
    expect(storedPost.pinned).toBeFalsy();
  });

  it('should allow posts to be pinned', async () => {
    expect.assertions(2);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test',
      numImages: 2
    };
    const id = await posts.create(post.author, post.title, post.content, post.numImages);
    const exists = await posts.setPinned(id, true);

    expect(exists).toBeTruthy();

    const storedPost = await posts.get(id) as Post;
    expect(storedPost.pinned).toBeTruthy();
  });

  it('should allow posts to be unpinned', async () => {
    expect.assertions(1);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test',
      numImages: 0
    };
    const id = await posts.create(post.author, post.title, post.content, post.numImages);
    await posts.setPinned(id, true);
    await posts.setPinned(id, false);

    const storedPost = await posts.get(id) as Post;
    expect(storedPost.pinned).toBeFalsy();
  });

  it('should return false for invalid posts', async () => {
    expect.assertions(1);

    const response = await posts.setPinned('test-test', true);
    expect(response).toBeFalsy();
  });
});

describe('removal', () => {
  it('should allow posts to be deleted', async () => {
    expect.assertions(2);

    const postId = await posts.create('test', 'test', 'test', 0);
    expect(await posts.get(postId)).toBeTruthy();
    await posts.remove(postId);
    expect(await posts.get(postId)).toBeFalsy();
  });

  it('should return true when post exists', async () => {
    expect.assertions(1);
    const postId = await posts.create('test', 'test', 'test', 0);
    expect(await posts.remove(postId)).toBeTruthy();
  });

  it('should return false when post does not exist', async () => {
    expect.assertions(1);
    expect(await posts.remove('testadsfadsf')).toBeFalsy();
  });
});
