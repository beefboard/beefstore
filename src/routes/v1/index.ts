import { Router } from 'express';
import me from './me';
import posts from './posts';
import users from './users';

const router = Router();

router.use('/me', me);
router.use('/posts', posts);
router.use('/users', users);

router.get('/', (_, res) => {
  res.send({
    me: '/me',
    posts: '/posts',
    users: '/users'
  });
});

export default router;
