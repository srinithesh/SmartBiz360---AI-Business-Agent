import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from './api';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL in production
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/v1', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error Handling Middleware (should be last)
app.use(errorHandler);

export default app;
