import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    // Set the strictQuery option to suppress the deprecation warning
    mongoose.set('strictQuery', false);

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/opinion_forge');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
    process.exit(1);
  }
};