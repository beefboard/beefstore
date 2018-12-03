import supertest from 'supertest';
import app from '../../app';

const posts = require('../../data/posts');
jest.mock('../../data/posts');

afterEach(() => {
  posts.getAll.mockReset();
  posts.get.mockReset();
  posts.remove.mockReset();
  posts.setApproval.mockReset();
  posts.setPinned.mockReset();
  posts.setNotified.mockReset();
  posts.setApprovalRequested.mockReset();
});

console.error = () => {};

describe('/v1/posts', () => {
  describe('GET /', async () => {
    it('should respond with list of posts from database', async () => {
      posts.getAll.mockImplementation(() => {
        return [{
          title: 'A post',
          content: 'About something'
        }];
      });

      const response = await supertest(app).get('/v1/posts');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        posts: [
          {
            title: 'A post',
            content: 'About something'
          }
        ]
      });
    });

    it('should pass query to posts database', async () => {
      posts.getAll.mockImplementation(() => {
        return [{
          title: 'A post',
          content: 'About something'
        }];
      });

      await supertest(app)
        .get('/v1/posts')
        .query({
          approved: 'false',
          page: '10'
        });

      expect(posts.getAll).toHaveBeenCalledWith({
        approved: 'false',
        page: '10'
      });
    });

    it('should respond with 500 on posts db error', async () => {
      posts.getAll.mockImplementation(() => {
        throw new Error('Query error');
      });

      const response = await supertest(app)
        .get('/v1/posts');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('GET /:id', async () => {
    it('should respond with data about the given post', async () => {
      posts.get.mockImplementation(() => {
        return {
          title: 'More titles',
          content: 'The content'
        };
      });

      const response = await supertest(app)
        .get('/v1/posts/sdfdsf');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ title: 'More titles', content: 'The content' });
    });

    it('should respond 404 if post does not exist', async () => {
      posts.get.mockImplementation(() => {
        return null;
      });

      const response = await supertest(app)
        .get('/v1/posts/sdfdsf');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not found' });
    });

    it('should respond with 500 on posts db error', async () => {
      posts.get.mockImplementation(() => {
        throw new Error('Oops error');
      });

      const response = await supertest(app)
        .get('/v1/posts/asdsd');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('DELETE /:id', async () => {
    it('should respond with 200 on success', async () => {
      posts.remove.mockImplementation(() => {
        return true;
      });

      const response = await supertest(app).delete('/v1/posts/sdfs');

      expect(response.status).toBe(200);
    });

    it('should send remove the given post id', async () => {
      posts.remove.mockImplementation(() => {
        return true;
      });

      await supertest(app).delete('/v1/posts/sdfs');

      expect(posts.remove).toHaveBeenCalledWith('sdfs');
    });

    it('should respond 404 if post does not exist', async () => {
      posts.remove.mockImplementation(() => {
        return false;
      });

      const response = await supertest(app).delete('/v1/posts/adsfdsf');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not found' });
    });

    it('should respond 500 on database error', async () => {
      posts.remove.mockImplementation(() => {
        throw new Error('Some error');
      });

      const response = await supertest(app).delete('/v1/posts/adsfdsf');
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('POST /', () => {
    it('should create a post with the given details', async () => {
      const response = await supertest(app)
        .post('/v1/posts')
        .send({
          title: 'title',
          content: 'content',
          author: 'me',
          numImages: 0
        });

      expect(posts.create).toHaveBeenCalledWith('me', 'title', 'content', 0);
    });

    it('should respond with post id after creation', async () => {
      posts.create.mockImplementation(() => {
        return 'theid';
      });

      const response = await supertest(app)
        .post('/v1/posts')
        .send({
          title: 'title',
          content: 'content',
          author: 'me',
          numImages: 0
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 'theid' });
    });

    it('should return 422 if not all details are passed', async () => {
      const response = await supertest(app)
        .post('/v1/posts')
        .send({
          title: 'title',
          content: 'content',
          author: 'me'
        });

      expect(response.status).toBe(422);
    });

    it('should return 500 on error creating post', async () => {
      posts.create.mockImplementation(() => {
        throw new Error('An error');
      });

      const response = await supertest(app)
        .post('/v1/posts')
        .send({
          title: 'title',
          content: 'content',
          author: 'me',
          numImages: 0
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('PUT /:id/approved', () => {
    it('should set approval of post to given approval', async () => {
      await supertest(app).put('/v1/posts/asdasf/approved').send({
        approved: true
      });

      expect(posts.setApproval).toHaveBeenCalledWith('asdasf', true);

      await supertest(app).put('/v1/posts/asdasf/approved').send({
        approved: false
      });

      expect(posts.setApproval).toHaveBeenCalledWith('asdasf', false);
    });

    it('should respond with success when successful', async () => {
      posts.setApproval.mockImplementation(() => {
        return true;
      });

      const response = await supertest(app)
        .put('/v1/posts/asdasf/approved')
        .send({
          approved: true
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should respond with 404 if post does not exist', async () => {
      posts.setApproval.mockImplementation(() => {
        return false;
      });

      const response = await supertest(app)
        .put('/v1/posts/asdasf/approved')
        .send({
          approved: true
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not found' });
    });

    it('should respond with 500 on database errors', async () => {
      posts.setApproval.mockImplementation(() => {
        throw new Error('Ow');
      });

      const response = await supertest(app)
        .put('/v1/posts/asdasf/approved')
        .send({
          approved: true
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('PUT /:id/pinned', () => {
    it('should set pinned mode of post to given value', async () => {
      await supertest(app).put('/v1/posts/asdasf/pinned').send({
        pinned: true
      });

      expect(posts.setPinned).toHaveBeenCalledWith('asdasf', true);

      await supertest(app).put('/v1/posts/asdasf/pinned').send({
        pinned: false
      });

      expect(posts.setPinned).toHaveBeenCalledWith('asdasf', false);
    });

    it('should respond with success when successful', async () => {
      posts.setPinned.mockImplementation(() => {
        return true;
      });

      const response = await supertest(app)
        .put('/v1/posts/asdasf/pinned')
        .send({
          approval: true
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should respond with 404 if post does not exist', async () => {
      posts.setPinned.mockImplementation(() => {
        return false;
      });

      const response = await supertest(app)
        .put('/v1/posts/asdasf/pinned')
        .send({
          approval: true
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not found' });
    });

    it('should respond with 500 on database errors', async () => {
      posts.setPinned.mockImplementation(() => {
        throw new Error('Ow');
      });

      const response = await supertest(app)
        .put('/v1/posts/asdasf/pinned')
        .send({
          approval: true
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('PUT /:id/notified', () => {
    it('should set notified status of post to given value', async () => {
      await supertest(app).put('/v1/posts/asdasf/notified').send({
        notified: true
      });

      expect(posts.setNotified).toHaveBeenCalledWith('asdasf', true);

      await supertest(app).put('/v1/posts/asdasf/notified').send({
        notified: false
      });

      expect(posts.setNotified).toHaveBeenCalledWith('asdasf', false);
    });

    it('should respond with success when successful', async () => {
      posts.setNotified.mockImplementation(() => {
        return true;
      });

      const response = await supertest(app)
        .put('/v1/posts/asdasf/notified')
        .send({
          notified: true
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should respond with 404 if post does not exist', async () => {
      posts.setNotified.mockImplementation(() => {
        return false;
      });

      const response = await supertest(app)
        .put('/v1/posts/asdasf/notified')
        .send({
          notified: true
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not found' });
    });

    it('should respond with 500 on database errors', async () => {
      posts.setNotified.mockImplementation(() => {
        throw new Error('Ow');
      });

      const response = await supertest(app)
        .put('/v1/posts/asdasf/notified')
        .send({
          notified: true
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('PUT /:id/approvalRequested', () => {
    it('should set requested status of post to given value', async () => {
      await supertest(app).put('/v1/posts/asdasf/approvalRequested').send({
        approvalRequested: true
      });

      expect(posts.setApprovalRequested).toHaveBeenCalledWith('asdasf', true);

      await supertest(app).put('/v1/posts/asdasf/approvalRequested').send({
        approvalRequested: false
      });

      expect(posts.setApprovalRequested).toHaveBeenCalledWith('asdasf', false);
    });

    it('should respond with success when successful', async () => {
      posts.setApprovalRequested.mockImplementation(() => {
        return true;
      });

      const response = await supertest(app)
        .put('/v1/posts/asdasf/approvalRequested')
        .send({
          approvalRequested: true
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    it('should respond with 404 if post does not exist', async () => {
      posts.setApprovalRequested.mockImplementation(() => {
        return false;
      });

      const response = await supertest(app)
        .put('/v1/posts/asdasf/approvalRequested')
        .send({
          approvalRequested: true
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not found' });
    });

    it('should respond with 500 on database errors', async () => {
      posts.setApprovalRequested.mockImplementation(() => {
        throw new Error('Ow');
      });

      const response = await supertest(app)
        .put('/v1/posts/asdasf/approvalRequested')
        .send({
          approvalRequested: true
        });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });
});
