const request = require('supertest');
const express = require('express');
const bodyParser = require('express').json;
const userRoutes = require('../routes/user');

const app = express();
app.use(bodyParser());
app.use('/api/user', userRoutes);

describe('User API', () => {
  it('should return 400 if required fields are missing on register', async () => {
    const res = await request(app).post('/api/user/register').send({ email: 'test@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('should return 400 if email is missing for OTP request', async () => {
    const res = await request(app).post('/api/user/request-otp').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('should return 400 if OTP is invalid or expired', async () => {
    const res = await request(app).post('/api/user/verify-otp').send({ email: 'fake@example.com', otp: '123456' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined();
  });
});
