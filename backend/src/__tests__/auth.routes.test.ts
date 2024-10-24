import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../server';
import { User } from '../models/user.model';

dotenv.config();

describe('Auth Routes', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword'
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should not register a user with existing email', async () => {
    await User.create({
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'testpassword'
    });

    const res = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'newuser',
      email: 'existing@example.com',
      password: 'testpassword'
    });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message', 'Email already exists');
  });

  it('should login a user and return a token', async () => {
    await User.create({
      username: 'loginuser',
      email: 'login@example.com',
      password: 'password123'
    });

    const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'login@example.com',
      password: 'password123'
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with incorrect password', async () => {
    await User.create({ 
      username: 'loginuser',
      email: 'login@example.com',
      password: 'password123'
    });

    const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'login@example.com',
      password: 'wrongpassword'
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should not login with incorrect email', async () => {
    await User.create({  
      username: 'loginuser',
      email: 'login@example.com',
      password: 'password123'
    });

    const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'wrong@example.com',
      password: 'password123'
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

});  
