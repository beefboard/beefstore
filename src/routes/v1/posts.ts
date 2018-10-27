import { Router } from 'express';
import * as posts from '../../data/posts';
import { guard, adminGuard } from '../../session';
import { AuthSession } from '../../data/db/db';

const router = Router();

router.get('/', async (req, res) => {
  const session = req.session;
  const query = req.query as posts.PostsQuery;

  // If the user has requested for unapproved posts
  if (query.approved != null && query.approved === false) {

    // The user is not admin, so return none
    if (!session || session.admin === false) {
      res.send({ posts: [] });
    }
    res.send({
      posts: await posts.getAll(query)
    });
  } else {
    // Send all posts where approved
    res.send({
      posts: await posts.getAll(query)
    });
  }
});

router.get('/:id', async (req, res) => {
  const postId = req.params.id;
  const session = req.session;

  try {
    const post = await posts.get(postId);

    // Don't allow post to be seen if we are not admin
    // and it has not been approved
    if (!post || !session
        || (!post.approved && !session.admin
            && post.author !== session.username)) {
      return res.status(404).send({ error: 'Not found' });
    }

    res.send(post);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal error' });
  }
});

router.use(guard);

router.delete('/:id', async (req, res) => {
  const session = req.session as AuthSession;

  const postId = req.params.id;
  try {
    const post = await posts.get(postId);
    if (!post) {
      return res.status(404);
    }

    // Cannot delete posts if you are not the owner, or you are not admin
    if (post.author !== session.username && session.admin) {
      return res.status(403).send({ error: 'Forbidden' });
    }

    await posts.remove(postId);
    res.send({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal error' });
  }
});

router.post('/', async (req, res) => {
  const session = req.session as AuthSession;

  const title = req.body.title;
  const content = req.body.content;
  const author = session.username;

  if (!title || !content) {
    return res.status(422).send({ error: 'Title and content must be provided' });
  }

  try {
    const id = await posts.create(author, title, content);
    res.send({ id: id });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal error' });
  }
});

router.use(adminGuard);

router.put('/:id/approved', async (req, res) => {
  const postId = req.params.id;

  try {
    const success = await posts.approve(postId);

    if (!success) {
      return res.status(404).send({ error: 'Not found' });
    }

    res.send({ succes: true });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal error' });
  }
});

router.put('/:id/pin', async (req, res) => {
  const postId = req.params.id;

  try {
    const success = await posts.pin(postId);

    if (!success) {
      return res.status(404).send({ error: 'Not found' });
    }

    res.send({ succes: true });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal error' });
  }
});

export default router;
