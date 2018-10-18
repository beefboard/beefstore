import * as posts from './posts';
import { Post } from './db/db';

describe('posts', () => {
  it('should store posts', async () => {
    expect.assertions(1);
    const id = await posts.create('test', 'test title', 'This is the content of the post');
    expect(id).not.toBe(null);
  });

  it('should return post from post id', async () => {
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

  it('should store creation date of posts', async () => {
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
});
