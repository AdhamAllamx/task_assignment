import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

const logFormat = format.combine(
  format.timestamp(),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

const transport = new transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = createLogger({
  format: logFormat,
  transports: [
    transport, // Log to daily rotating files
    new transports.Console(), // Log to the console
  ],
});

export default logger;
