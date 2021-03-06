import 'source-map-support/register';

import app from './app';
import { initDb } from './data/db/db';

const PORT = process.env.PORT || 2833;

(async () => {
  try {
    await initDb();
  } catch (e) {
    console.error(`Could not initialise database: ${e.message}`);
    throw e;
  }

  app.listen(PORT, async () => {
    console.log(`Listening on ${PORT}`);
  });
})();
