import { Router } from 'express';
import posts from './posts';

const router = Router();
router.use('/posts', posts);

router.get('/', (_, res) => {
  res.send({
    posts: '/posts',
  });
});

export default router;
