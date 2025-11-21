require('dotenv').config();

// Suppress config warning since we use environment variables
process.env.SUPPRESS_NO_CONFIG_WARNING = 'true';

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db.js");

const app = express();

app.set('trust proxy', 1);

// Allowed origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL,           // Main frontend URL from environment
  'http://localhost:3000',          // Local development
  'http://localhost:5000',          // Local development
  'https://roxana-connect.netlify.app', // Production frontend
].filter(Boolean);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list or matches Netlify/Vercel patterns
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.netlify.app') || 
                      origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization', 'Accept'],
  exposedHeaders: ['x-auth-token']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  } : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

const cacheControl = (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  next();
};

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

app.get("/images/:userId", (req, res) => {
  const userId = req.params.userId;
  const imagePath = path.join(__dirname, "public", "images", userId);
  const defaultImagePath = path.join(__dirname, "public", "default.png");

  res.set('Cache-Control', 'public, max-age=604800');
  res.set('ETag', `"${userId}"`);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.sendFile(defaultImagePath);
    } else {
      res.sendFile(imagePath);
    }
  });
});

app.use(generalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

connectDB();

app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

app.use("/api/users", require("./routes/users.js"));
app.use("/api/profiles", require("./routes/profiles.js"));
app.use("/api/posts", require("./routes/posts.js"));
app.use("/api/internships", require("./routes/internships.js"));
app.use("/api/tracking", require("./routes/tracking.js"));
app.use("/api/admin", require("./routes/admin.js"));
app.use("/api/upload", require("./routes/upload.js"));

app.get("/", (req, res) => res.send("Server is working correctly"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
  console.log('Allowed CORS origins:', allowedOrigins);
});
