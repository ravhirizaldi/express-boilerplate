import winston from 'winston';
import chalk from 'chalk';

// 🎨 Warna custom via chalk
const chalkColors = {
  error: chalk.red.bold,
  warn: chalk.yellow.bold,
  info: chalk.green.bold,
  http: chalk.magenta.bold,
  verbose: chalk.blue.bold,
  debug: chalk.cyan.bold,
  silly: chalk.gray.bold,
};

// 🖊 Format custom
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const levelUpper = level.toUpperCase().padEnd(5);
  const colorFn = chalkColors[level] || ((txt) => txt);
  return `[${chalk.gray(timestamp)}] ${colorFn(levelUpper)}: ${message}`;
});

// 🛠 Buat logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat,
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
