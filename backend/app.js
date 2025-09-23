import dotenv from 'dotenv';
import Router from './src/routes/index.js';
import errorHandler from './src/middleware/error.middleware.js';
import express from 'express';


var app=express();
dotenv.config();

//Register routes
app.use('/api/v1', Router);

//Global error handler
app.use(errorHandler);

export default app;