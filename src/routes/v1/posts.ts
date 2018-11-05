import { Router } from 'express';
import * as posts from '../../data/posts';

const router = Router();

router.get('/', async (req, res) => {
  const query = req.query as posts.PostsQuery;
  try {
    res.send({
      posts: await posts.getAll(query)
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal error' });
  }
});

router.get('/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await posts.get(postId);

    if (post) {
      return res.status(404).send({ error: 'Not found' });
    }

    res.send(post);
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal error' });
  }
});

router.delete('/:id', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await posts.get(postId);
    if (!post) {
      return res.status(404);
    }

    await posts.remove(postId);
    res.send({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal error' });
  }
});

router.post('/', async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const author = req.body.author;
  const numImages = req.body.numImages;

  if (!title || !content || numImages === undefined || !author) {
    return res.status(422).send({
      error: 'Title and content author and numImages must be provided'
    });
  }

  try {
    const id = await posts.create(author, title, content, numImages);
    res.send({ id: id });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Internal error' });
  }
});

router.put('/:id/approved', async (req, res) => {
  const postId = req.params.id;
  const approval = req.body.approval === 'true';

  try {
    const success = await posts.setApproval(postId, approval);

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
  const pinned = req.body.pinned === 'true';

  try {
    const success = await posts.setPinned(postId, pinned);

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
