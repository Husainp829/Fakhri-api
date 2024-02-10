const winston = require("winston");
const appRoot = require("app-root-path");
const DailyRotateFile = require("winston-daily-rotate-file");
require("dotenv").config();

const options = {
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
    align: true,
    humanReadableUnhandledException: true,
  },
};

const transport = new DailyRotateFile({
  filename: `${appRoot}/logs/application-%DATE%.log`,
  // filename: 'C:\\Users\\PCS\\Desktop\\New folder\\application-%DATE%.log',
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  align: true,
  humanReadableUnhandledException: true,
  // maxSize: '20m',
  // maxFiles: null
});

const transports = [transport];

if (process.env.NODE_ENV === "development") {
  transports.push(new winston.transports.Console(options.console));
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

winston.remove(winston.transports.Console);
module.exports = logger;
