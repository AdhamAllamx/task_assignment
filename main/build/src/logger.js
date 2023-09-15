"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
require("winston-daily-rotate-file");
const logFormat = winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
}));
const transport = new winston_1.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});
const logger = (0, winston_1.createLogger)({
    format: logFormat,
    transports: [
        transport,
        new winston_1.transports.Console(), // Log to the console
    ],
});
exports.default = logger;
