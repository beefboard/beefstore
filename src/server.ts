import 'source-map-support/register';

import app from './app';
import { initDb } from './data/db/db';

(async () => {
  try {
    await initDb();
  } catch (e) {
    console.error(`Could not initialise database: ${e.message}`);
  }

  app.listen(2832, async () => {
    console.log('Listening on 2835');
  });
})();
