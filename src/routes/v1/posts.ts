import { Router } from 'express';
import * as posts from '../../data/posts';
import { guard } from '../../session';

const router = Router();

router.use(guard);
router.get('/', async (req, res) => {
  res.send({
    products: await posts.getAll()
  });
});

export default router;
