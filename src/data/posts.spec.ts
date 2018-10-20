import * as posts from './posts';
import { Post } from './db/db';

describe('creation', () => {
  /**
   * remove all posts when every test runs
   */
  beforeEach(async () => {
    await posts.clear();
  });

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
});

describe('retreival', () => {
  beforeEach(async () => {
    await posts.clear();
  });

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
    expect(storedPost.date.getDate()).toBe(new Date().getDate());
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
  beforeEach(async () => {
    await posts.clear();
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
    expect.assertions(1);

    const post = {
      title: 'test title',
      author: 'test',
      content: 'test'
    };
    const id = await posts.create(post.author, post.title, post.content);
    await posts.pin(id);

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
