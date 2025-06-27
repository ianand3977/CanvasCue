const request = require('supertest');
const express = require('express');
const authRoutes = require('./auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
  it('should return 400 if username or password is missing on register', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Username and password required');
  });

  it('should return 400 if username or password is missing on login', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Username and password required');
  });
});
