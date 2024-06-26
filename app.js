const express = require("express");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const errorHandler = require("./middlewares/error.js");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
// to color logs
const colors = require("colors");
const dotenv = require("dotenv");
const { swaggerUi, swaggerDocs } = require("./swagger");

// Load env vars
dotenv.config();

// DB configuration
const connectDB = require("./config/db.js");

// Route files
const users = require("./routes/users.js");
const propertyRequests = require("./routes/propertyRequests.js");
const ads = require("./routes/ads.js");
const statistics = require("./routes/statistics.js");

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Mount routers
app.use("/api/v1/users", users);
app.use("/api/v1/property-requests", propertyRequests);
app.use("/api/v1/ads", ads);
app.use("/api/v1/stats", statistics);

// Swagger setup
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
