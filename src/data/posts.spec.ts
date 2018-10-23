import * as posts from './posts';
import { Post } from './db/db';

beforeEach(async () => {
  await posts.clear();
});

describe('creation', () => {
  it('should return post id', async () => {
    expect.assertions(1);
    const id = await posts.create('test', 'test title', 'This is the content of the post');
    expect(id).not.toBeNull();
  });

  it('should generate unique post id\'s', async () => {
    expect.assertions(1);
    const id1 = await posts.create('test', 'test title', 'This is the content of the post');
    const id2 = await posts.create('test', 'test title', 'This is the content of the post');
    expect(id1).not.toBe(id2);
  });
});

describe('retreival', () => {
  it('should return posts by post id', async () => {
    expect.assertions(3);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test'

    };
    const id = await posts.create(post.author, post.title, post.content);

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
      content: 'test'
    };
    const id = await posts.create(post.author, post.title, post.content);

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
        content: 'test'
      };
      const id = await posts.create(post.author, post.title, post.content);
    }

    const allPosts = await posts.getAll();
    expect(allPosts.length).toBe(numPosts);
  });
});

describe('approval', () => {
  test('new posts should not be approved', async () => {
    expect.assertions(1);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test'
    };
    const id = await posts.create(post.author, post.title, post.content);
    const storedPost = await posts.get(id) as Post;

    expect(storedPost.approved).not.toBeTruthy();
  });

  it('should allow new posts to be approved', async () => {
    expect.assertions(1);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test'
    };
    const id = await posts.create(post.author, post.title, post.content);
    await posts.approve(id);

    const storedPost = await posts.get(id) as Post;
    expect(storedPost.approved).toBeTruthy();
  });

  it('should return false for invalid posts', async () => {
    expect.assertions(1);

    const successful = await posts.approve('asdfjasdf');

    expect(successful).toBeFalsy();
  });

});

describe('pinning', async () => {
  test('posts should not be pinned by default', async () => {
    expect.assertions(1);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test'
    };
    const id = await posts.create(post.author, post.title, post.content);

    const storedPost = await posts.get(id) as Post;
    expect(storedPost.pinned).toBeFalsy();
  });

  it('should allow posts to be pinned', async () => {
    expect.assertions(2);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test'
    };
    const id = await posts.create(post.author, post.title, post.content);
    const exists = await posts.pin(id);

    expect(exists).toBeTruthy();

    const storedPost = await posts.get(id) as Post;
    expect(storedPost.pinned).toBeTruthy();
  });

  it('should allow posts to be unpinned', async () => {
    expect.assertions(1);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test'
    };
    const id = await posts.create(post.author, post.title, post.content);
    await posts.pin(id);
    await posts.unpin(id);

    const storedPost = await posts.get(id) as Post;
    expect(storedPost.pinned).toBeFalsy();
  });

  it('should return false for invalid posts', async () => {
    expect.assertions(1);

    const response = await posts.pin('test-test');
    expect(response).toBeFalsy();
  });
});
