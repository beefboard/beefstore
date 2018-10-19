import { Router } from 'express';
import { guard } from '../../session';
import * as account from '../../data/account';

const router = Router();

router.put('/', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const token = await account.login(username, password);

  if (!token) {
    res.status(401).send({
      error: 'Unauthorised'
    });

    return;
  }

  res.send({
    token: token
  });
});

router.use(guard);

router.get('/', async (req, res) => {
  res.send(req.session);
});

export default router;
