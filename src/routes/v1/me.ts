import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.send(req.session);
});

export default router;
