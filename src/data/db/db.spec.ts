import * as db from './db';

describe('db', () => {
  describe('initdb', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('should initialise with sqlite in test mode', async () => {
      await db.initDb();
      expect(db.db.client.config.client).toBe('sqlite3');
    });

    it('should initialise with pg when not in test mode', async () => {
      process.env.NODE_ENV = 'production';
      // Don't expect postgress table generation to work
      try {
        await db.initDb();
      } catch (_) {}
      expect(db.db.client.config.client).toBe('pg');
    });

    it('should generate posts table', async () => {
      await db.initDb();
      expect(await db.db.schema.hasTable(db.TABLE_POSTS)).toBe(true);
    });
  });

  describe('generatePostsTable', async () => {
    it('should only generate the posts table if it does not exist', async () => {
      await db.initDb();
      let thrown = null;

      try {
        await db.generatePostsTable();
      } catch (e) {
        thrown = e;
      }

      expect(thrown).toBe(null);
    });
  });
});
