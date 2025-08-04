import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import logger from './utils/logger.js';
import requestLogger from './middleware/request-logger.js';
import routes from './routes/index.js';

// Muat .env lalu override dengan .env.{NODE_ENV} jika ada
dotenv.config();
dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
  override: true,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by'); // Disable 'X-Powered-By' header for security

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW_MS || 15) * 60 * 1000, // Default to 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // Default to 100 requests
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    message: 'Too many requests from this IP, please try again later.',
  },
});

app.use(limiter); // Apply rate limiting middleware

//check if NODE_ENV is set to production
if (process.env.NODE_ENV === 'production') {
  app.use(helmet()); // default full security
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default, can be overridden
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    }),
  ); // Enable CORS for all origins
} else {
  app.use(
    helmet({
      contentSecurityPolicy: false, // biar ga ganggu inline script/style
      crossOriginEmbedderPolicy: false, // biar ga blok resource dari origin lain
    }),
  );
}

// Middleware untuk menghindari HTTP Parameter Pollution (HPP)
app.use(hpp());

// Middleware untuk parsing JSON body
app.use(express.json());

// Middleware untuk parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Middleware untuk logging request
app.use(requestLogger);

app.get('/', (_req, res) => {
  res.redirect('/api');
});

// Gunakan routes
app.use('/api', routes);

//catch-all route untuk menangani 404 Not Found
app.use((_req, res) => {
  res.redirect('/api');
});

app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
