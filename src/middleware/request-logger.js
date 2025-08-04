import chalk from 'chalk';
import logger from '../utils/logger.js';

/** Colorize HTTP method and status code for better visibility in logs */
/** * Colorizes the HTTP method for better visibility in logs.
 * @param {string} method - The HTTP method (e.g., GET, POST).
 * @return {string} - The colored HTTP method.
 * @example
 * colorMethod('GET'); // Returns a blue colored string for GET method.
 * */
function colorMethod(method) {
  switch (method) {
    case 'GET':
      return chalk.blue(method);
    case 'POST':
      return chalk.green(method);
    case 'PUT':
      return chalk.yellow(method);
    case 'DELETE':
      return chalk.red(method);
    default:
      return chalk.cyan(method);
  }
}

/** * Colorizes the HTTP status code for better visibility in logs.
 * @param {number} status - The HTTP status code (e.g., 200, 404).
 * @return {string} - The colored HTTP status code.
 * @example
 * colorStatus(200); // Returns a green colored string for 200 status.
 * */
function colorStatus(status) {
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.yellow(status);
  if (status >= 300) return chalk.cyan(status);
  if (status >= 200) return chalk.green(status);
  return status;
}

/**
 * Middleware to log HTTP requests with method, URL, status code, and duration.
 * @param {import('express').Request} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @example
 * app.use(requestLogger);
 */
export default function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    const method = colorMethod(req.method);
    const status = colorStatus(res.statusCode);
    const url = chalk.white(req.originalUrl);

    logger.http(`${method} ${url} ${status} ${durationMs.toFixed(1)}ms`);
  });

  next();
}
