import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
// import opinionRoutes from './routes/opinion.routes';

dotenv.config();

const { json } = bodyParser;

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

if (process.env.NODE_ENV !== 'production') {
  console.log('NODE_ENV: ' + process.env.NODE_ENV);
  console.log('cors enabled for development');
  app.use(cors(corsOptions));
} else {
  console.log('cors disabled for production');
}

app.use(json());

app.use('/api/auth', authRoutes);

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendBuildPath));

  // Handle React routing, return all requests to React app
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // Development routes
app.get('/', (req, res) => {
  console.log('/ hit : ' + req.body);
    res.send('Welcome to Opinion Forge API');
});

app.get('/test', (_req, res) => {
  res.send('Test endpoint hit');
});
}

export default app;