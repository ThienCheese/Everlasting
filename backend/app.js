import dotenv from 'dotenv';
import Router from './src/routes/index.js';
import errorHandler from './src/middleware/error.middleware.js';
import express from 'express';

const app = express();
dotenv.config();

// ✅ Parse body trước
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Rồi mới đến routes
app.use('/api', Router);

// ✅ Cuối cùng là error handler
app.use(errorHandler);

export default app;
