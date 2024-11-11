import mongoose from 'mongoose';
import { User } from '../models/user.model';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import '@jest/globals';
dotenv.config();

describe('User Model Test', () => {
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

  it('should create & save user successfully', async () => {
    const validUser = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword'
    });
    const savedUser = await validUser.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(validUser.username);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.password).toBe(validUser.password);
  });

  it('should fail to save user with missing required fields', async () => {
    const userWithoutRequiredFields = new User({ username: 'testuser' });
    let err;
    try {
      await userWithoutRequiredFields.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should fail to save user with invalid email', async () => {
    const userWithInvalidEmail = new User({
      username: 'testuser',
      email: 'invalid_email',
      password: 'testpassword'
    });
    let err: any;
    try {
      await userWithInvalidEmail.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });

  it('should correctly compare passwords', async () => {
    const user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword'
    });
    await user.save();

    const isMatch = await user.comparePassword('testpassword');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

})
