import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import xss from "xss-clean";
import { cleanup } from "./config/database.js";
import routes from "./api/routes/index.js";
import i18next from "i18next";
import backend from "i18next-fs-backend";
import i18nextMiddleware from "i18next-http-middleware";
import path from "path";
import { fileURLToPath } from "url";
import useragent from "express-useragent";
import redisService from "./config/redis.js";
import { logger } from "@userplus/logger";

// Make logger globally available
global.$logger = logger;

const app = express();

// Trust proxy if behind a reverse proxy (like nginx)
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    dnsPrefetchControl: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600, // 10 minutes
  })
);

app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body parsing with size limits
app.use(
  express.json({
    limit: "10kb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

// Compression
app.use(
  compression({
    level: 6,
    threshold: 10 * 1000, // 10kb
  })
);

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure i18next
i18next
  .use(backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: path.join(__dirname, "./utils/lang/{{lng}}/translation.json"),
    },
    // Optional: additional configurations
    // debug: process.env.NODE_ENV === 'development',
    preload: ["en"], // preload English translations
    saveMissing: true,
    detection: {
      order: ["header", "querystring", "cookie"],
      lookupHeader: "accept-language",
    },
  });

// Apply the middleware
app.use(i18nextMiddleware.handle(i18next));

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());

// Routes
app.use("/", routes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// Request logging in development
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Response time header
app.use((req, res, next) => {
  res.startTime = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - res.startTime;
    res.set("X-Response-Time", `${duration}ms`);
  });
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Auth Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Add shutdown handler
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received.");
  await redisService.shutdown();
  await cleanup();
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

export default app;
