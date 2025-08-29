require("./global_functions"); // instantiate global functions
require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const firebase = require("firebase-admin");
const { default: rateLimit } = require("express-rate-limit");

const serviceAccount = require("./fcmkey.json");
const winston = require("./core/const/winston");
const constants = require("./core/const/constants");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

const app = express();

// Limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all routes
app.use(limiter);

app.all("/*", (req, res, next) => {
  // const corsWhitelist = constants.ALLOWED_ORIGINS[process.env.NODE_ENV];
  // if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,authorization, x-customer-token, eventid"
  );
  // }

  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Expose-Headers", "x-total-count");
  if (req.method === "OPTIONS") {
    res.status(constants.HTTP_STATUS_CODES.OK).end();
  } else {
    next();
  }
});

app.use(morgan("combined", { stream: winston.stream }));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(express.text({ type: "*/*", limit: "5mb" }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());
app.use("/", require("./core/routes"));

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // add this line to include winston logging
  winston.error(
    `${err.status || constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR} - ${err.message} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );

  // render the error page
  res.status(err.status || constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  next();
});

process.on("uncaughtException", (err) => {
  winston.error("Application Exception: ", err);
});

module.exports = app;
