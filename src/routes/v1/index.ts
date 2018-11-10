import { Router } from 'express';
import posts from './posts';

const router = Router();

router.get('/', (_, res) => {
  res.send({
    posts: '/posts',
  });
});

router.use('/posts', posts);

export default router;
