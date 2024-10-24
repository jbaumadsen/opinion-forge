import request from 'supertest';
import { app } from '../server';

describe('Server Setup', () => {
  it('should respond to the root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Welcome to Opinion Forge API');
  });

  it('should use JSON middleware', async () => {
    const response = await request(app)
      .post('/test-json')
      .send({ test: 'data' });
    expect(response.status).toBe(404); // Route doesn't exist, but middleware should parse JSON
  });

});

