import dotenv from 'dotenv';
import cors from 'cors';
import Router from './src/routes/index.js';
import errorHandler from './src/middleware/error.middleware.js';
import { requestLogger, errorLogger } from './src/middleware/logging.middleware.js';
import { sanitizeInput, checkDangerousCharacters, checkRequestSize } from './src/middleware/sanitize.middleware.js';
import { apiLimiter } from './src/middleware/ratelimit.middleware.js';
import express from 'express';

const app = express();
dotenv.config();

// ✅ CORS - Cho phép frontend gọi API
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Request logging
app.use(requestLogger);

// ✅ Parse body trước
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Security middleware
app.use(checkRequestSize(10 * 1024 * 1024)); // 10MB limit
app.use(sanitizeInput);
app.use(checkDangerousCharacters);

// ✅ Rate limiting cho toàn bộ API
app.use('/api', apiLimiter);

// ✅ Rồi mới đến routes
app.use('/api', Router);

// ✅ Error logging
app.use(errorLogger);

// ✅ Cuối cùng là error handler
app.use(errorHandler);

export default app;
