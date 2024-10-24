import mongoose from 'mongoose';
import { Opinion, IOpinion } from '../models/opinion.model';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
dotenv.config();

describe('Opinion Model Test', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('create & save opinion successfully', async () => {
    const validOpinion = new Opinion({
      content: 'This is a valid opinion',
      author: 'user123',
      question: 'question456',
      bucket: 'bucket789'
    });
    const savedOpinion = await validOpinion.save();
    
    expect(savedOpinion._id).toBeDefined();
    expect(savedOpinion.content).toBe(validOpinion.content);
    expect(savedOpinion.author).toBe(validOpinion.author);
    expect(savedOpinion.question).toBe(validOpinion.question);
    expect(savedOpinion.bucket).toBe(validOpinion.bucket);
  });

  it('insert opinion successfully, but the field not defined in schema should be undefined', async () => {
    const opinionWithInvalidField = new Opinion({
      content: 'This is a valid opinion',
      author: 'user123',
      question: 'question456',
      bucket: 'bucket789',
      invalid_field: 'test'
    } as IOpinion & { invalid_field: string });

    const savedOpinionWithInvalidField = await opinionWithInvalidField.save();
    expect(savedOpinionWithInvalidField._id).toBeDefined();
    expect((savedOpinionWithInvalidField as any).invalid_field).toBeUndefined();
  });

  it('create opinion without required field should fail', async () => {
    const opinionWithoutRequiredField = new Opinion({ author: 'user123' });
    let err: any;
    try {
      await opinionWithoutRequiredField.save();
    } catch (error: unknown) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.content).toBeDefined();
  });
});