import { Router, Response } from 'express';
import * as posts from '../../data/posts';

const router = Router();

function handleError(e: any, res: Response) {
  console.error(e);
  res.status(500).send({ error: 'Internal error' });
}

router.get('/', async (req, res) => {
  const query = req.query as posts.PostsQuery;
  try {
    res.send({
      posts: await posts.getAll(query)
    });
  } catch (e) {
    handleError(e, res);
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
    handleError(e, res);
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
    handleError(e, res);
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
    handleError(e, res);
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
    handleError(e, res);
  }
});

router.put('/:id/pinned', async (req, res) => {
  const postId = req.params.id;
  const pinned = req.body.pinned === 'true';

  try {
    const success = await posts.setPinned(postId, pinned);

    if (!success) {
      return res.status(404).send({ error: 'Not found' });
    }

    res.send({ succes: true });
  } catch (e) {
    handleError(e, res);
  }
});

router.put('/:id/notified', async (req, res) => {
  const postId = req.params.id;
  const notified = req.body.notified === 'true';

  try {
    const success = await posts.setNotified(postId, notified);

    if (!success) {
      return res.status(404).send({ error: 'Not found' });
    }

    res.send({ succes: true });
  } catch (e) {
    handleError(e, res);
  }
});

router.put('/:id/approvalRequested', async (req, res) => {
  const postId = req.params.id;
  const approvalRequested = req.body.approvalRequested === 'true';

  try {
    const success = await posts.setApprovalRequested(postId, approvalRequested);

    if (!success) {
      return res.status(404).send({ error: 'Not found' });
    }

    res.send({ succes: true });
  } catch (e) {
    handleError(e, res);
  }
});

export default router;
