import dotenv from 'dotenv';
import express from 'express';
import logger from './utils/logger.js';
import requestLogger from './middleware/request-logger.js';

// Muat .env lalu override dengan .env.{NODE_ENV} jika ada
dotenv.config();
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
  override: true,
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk logging request
app.use(requestLogger);

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || 'development',
    message: 'Hello World!',
  });
});

app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
