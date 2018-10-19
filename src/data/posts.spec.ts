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
    expect(id).not.toBe(null);
  });

  it('should generate different post id\'s', async () => {
    expect.assertions(1);
    const id1 = await posts.create('test', 'test title', 'This is the content of the post');
    const id2 = await posts.create('test', 'test title', 'This is the content of the post');
    expect(id1).not.toBe(id2);
  });
});

describe('retreival', () => {
  beforeEach(async () => {
    await posts.clear();
  });

  it('should return posts from post id', async () => {
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
  it('new posts should not be approved', async () => {
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
