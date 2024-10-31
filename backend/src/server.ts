import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
// import opinionRoutes from './routes/opinion.routes';

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

if (process.env.NODE_ENV !== 'production') {
  console.log('cors enabled');
  console.log(corsOptions);
  app.use(cors(corsOptions));
}

app.use(json());

app.get('/', (req, res) => {
  console.log('/ hit : ' + req.body);
    res.send('Welcome to Opinion Forge API');
});

app.get('/test', (req, res) => {
  res.send('Test endpoint hit');
});

app.use('/api/auth', authRoutes);


export { app };

