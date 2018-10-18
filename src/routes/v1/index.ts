import { Router } from 'express';
import me from './me';
import posts from './posts';

const router = Router();

router.use('/me', me);
router.use('/posts', posts);

router.get('/', (req, res) => {
  res.send({
    me: '/me',
    posts: '/posts'
  });
});

export default router;
