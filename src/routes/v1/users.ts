import { Router } from 'express';
import { guard, adminGuard } from '../../session';
import * as accounts from '../../data/accounts';

const router = Router();

router.post('/', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const success = await accounts.register(username, password, firstName, lastName, false);

  if (!success) {
    res.status(422).send({
      error: 'Username already exists'
    });

    return;
  }

  res.send({ success: true });
});

router.use(adminGuard);

router.get('/', async (req, res) => {
  res.send({ users: [] });
});

export default router;
