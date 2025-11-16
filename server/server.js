require('dotenv').config();
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db.js");

const app = express();

// Trust proxy - important for rate limiting behind reverse proxy (Heroku, Nginx, etc.)
app.set('trust proxy', 1);

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
};
app.use(cors(corsOptions));

// Security headers - configured for production
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

// Rate limiting - general (relaxed for normal usage)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting - strict for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  skipSuccessfulRequests: true, // Don't count successful logins
  standardHeaders: true,
  legacyHeaders: false,
});

// Cache control middleware for static files
const cacheControl = (req, res, next) => {
  // Cache static assets for 1 year
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  next();
};

// Serve static files with cache headers
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d', // 1 day cache for static files
  etag: true,
  lastModified: true
}));

// Custom middleware to serve profile images with fallback and cache headers
app.get("/images/:userId", (req, res) => {
  const userId = req.params.userId;
  const imagePath = path.join(__dirname, "public", "images", userId);
  const defaultImagePath = path.join(__dirname, "public", "default.png");

  // Set cache headers for images (7 days)
  res.set('Cache-Control', 'public, max-age=604800');
  res.set('ETag', `"${userId}"`);

  // Check if user's profile image exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If user's image doesn't exist, serve the default image
      res.sendFile(defaultImagePath);
    } else {
      // If user's image exists, serve it
      res.sendFile(imagePath);
    }
  });
});

app.use(generalLimiter);
app.use(express.json({ limit: '10mb' })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API response cache control - no cache for API responses
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

connectDB();

// Apply strict rate limiting to auth endpoints
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

app.use("/api/users", require("./routes/users.js"));
app.use("/api/profiles", require("./routes/profiles.js"));
app.use("/api/posts", require("./routes/posts.js"));
app.use("/api/internships", require("./routes/internships.js"));
app.use("/api/tracking", require("./routes/tracking.js"));
app.use("/api/admin", require("./routes/admin.js"));

app.get("/", (req, res) => res.send("Server is working correctly"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
