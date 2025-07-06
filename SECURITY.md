# 🔒 Security Guidelines for Roxana

This document provides comprehensive security guidelines for deploying and maintaining the Roxana social media platform.

## 🛡️ Security Overview

Roxana implements multiple layers of security to protect user data and ensure platform integrity:

### Authentication & Authorization
- JWT-based authentication with secure token management
- Password hashing using bcrypt with salt rounds
- Role-based access control (RBAC)
- Session management and token expiration

### Data Protection
- Input validation and sanitization
- CORS configuration for cross-origin requests
- SQL injection prevention (MongoDB NoSQL injection protection)
- XSS (Cross-Site Scripting) prevention

### File Upload Security
- File type validation
- File size limits
- Secure file storage with proper permissions
- Image processing and optimization

## 🔐 Environment Variables

### Required Environment Variables

Create a `.env` file in the server directory:

```env
# Application
NODE_ENV=production
PORT=4000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/roxana?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=24h

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./public/uploads

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Security Best Practices for Environment Variables

1. **Never commit `.env` files to Git**
   ```bash
   # Add to .gitignore
   echo ".env" >> .gitignore
   echo "*.env" >> .gitignore
   ```

2. **Use strong, unique secrets**
   ```bash
   # Generate a secure JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Rotate secrets regularly**
   - Change JWT secrets every 90 days
   - Update database passwords quarterly
   - Monitor for compromised credentials

## 🗄️ Database Security

### MongoDB Atlas Security Configuration

1. **Network Access**
   ```javascript
   // Configure IP whitelist
   // Add your application server IP
   // For development: 0.0.0.0/0 (not recommended for production)
   ```

2. **Database User**
   ```javascript
   // Create dedicated database user
   {
     user: "roxana_user",
     pwd: "secure-password-here",
     roles: [
       { role: "readWrite", db: "roxana" }
     ]
   }
   ```

3. **Connection String**
   ```javascript
   // Use connection string with authentication
   mongodb+srv://username:password@cluster.mongodb.net/roxana?retryWrites=true&w=majority
   ```

### Database Security Best Practices

1. **Enable MongoDB Atlas Security Features**
   - Enable authentication
   - Configure network access
   - Enable encryption at rest
   - Enable audit logging

2. **Regular Backups**
   ```bash
   # Automated backup script
   mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/roxana" --out=/backup/$(date +%Y%m%d)
   ```

3. **Monitor Database Access**
   - Enable MongoDB Atlas monitoring
   - Set up alerts for unusual activity
   - Review access logs regularly

## 🔒 API Security

### Input Validation

```javascript
// Example: User registration validation
const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Name must be between 2 and 30 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
];
```

### Rate Limiting

```javascript
// Implement rate limiting
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later'
});

app.use('/api/users/login', authLimiter);
```

### CORS Configuration

```javascript
// Secure CORS configuration
const cors = require('cors');

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000/roxana',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

## 🛡️ Authentication Security

### JWT Configuration

```javascript
// JWT token configuration
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '24h',
      issuer: 'roxana-app',
      audience: 'roxana-users'
    }
  );
};
```

### Password Security

```javascript
// Password hashing with bcrypt
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
```

### Session Management

```javascript
// Secure session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

## 📁 File Upload Security

### Multer Configuration

```javascript
// Secure file upload configuration
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});
```

### File Validation

```javascript
// Additional file validation
const validateImageUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ message: 'Invalid file type' });
  }

  // Check file size
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;
  if (req.file.size > maxSize) {
    return res.status(400).json({ message: 'File too large' });
  }

  next();
};
```

## 🚀 Production Deployment Security

### Server Security

1. **Use HTTPS**
   ```javascript
   // Force HTTPS in production
   if (process.env.NODE_ENV === 'production') {
     app.use((req, res, next) => {
       if (req.header('x-forwarded-proto') !== 'https') {
         res.redirect(`https://${req.header('host')}${req.url}`);
       } else {
         next();
       }
     });
   }
   ```

2. **Security Headers**
   ```javascript
   // Add security headers
   const helmet = require('helmet');
   
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         styleSrc: ["'self'", "'unsafe-inline'"],
         scriptSrc: ["'self'"],
         imgSrc: ["'self'", "data:", "https:"],
       },
     },
   }));
   ```

3. **Remove Sensitive Information**
   ```javascript
   // Don't expose server information
   app.disable('x-powered-by');
   ```

### Environment-Specific Configuration

```javascript
// Production configuration
if (process.env.NODE_ENV === 'production') {
  // Enable compression
  app.use(compression());
  
  // Serve static files securely
  app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
    maxAge: '1d',
    etag: true
  }));
  
  // Enable request logging
  app.use(morgan('combined'));
}
```

## 🔍 Security Monitoring

### Logging

```javascript
// Security event logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/security.log' }),
    new winston.transports.Console()
  ]
});

// Log security events
const logSecurityEvent = (event, details) => {
  logger.info('Security Event', {
    event,
    details,
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
};
```

### Error Handling

```javascript
// Secure error handling
app.use((err, req, res, next) => {
  // Don't expose internal errors to clients
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ message: 'Internal server error' });
  } else {
    res.status(500).json({ message: err.message, stack: err.stack });
  }
  
  // Log error for debugging
  logger.error('Application Error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
});
```

## 🚨 Incident Response

### Security Incident Checklist

1. **Immediate Response**
   - Isolate affected systems
   - Preserve evidence
   - Notify security team
   - Assess impact scope

2. **Investigation**
   - Review logs and monitoring data
   - Identify root cause
   - Document findings
   - Implement temporary fixes

3. **Recovery**
   - Apply security patches
   - Update compromised credentials
   - Restore from clean backups
   - Verify system integrity

4. **Post-Incident**
   - Conduct post-mortem analysis
   - Update security procedures
   - Train team members
   - Monitor for recurrence

### Emergency Contacts

```javascript
// Security contact information
const SECURITY_CONTACTS = {
  primary: 'security@yourcompany.com',
  backup: 'admin@yourcompany.com',
  phone: '+1-555-123-4567'
};
```

## 📋 Security Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database security enabled
- [ ] HTTPS certificates installed
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation active
- [ ] File upload restrictions set
- [ ] Error handling secure
- [ ] Logging configured
- [ ] Backups scheduled

### Post-Deployment
- [ ] Monitor application logs
- [ ] Review security alerts
- [ ] Update dependencies regularly
- [ ] Conduct security audits
- [ ] Test backup restoration
- [ ] Verify monitoring systems
- [ ] Update security documentation
- [ ] Train team on procedures

## 📚 Additional Resources

### Security Tools
- [OWASP ZAP](https://owasp.org/www-project-zap/) - Web application security scanner
- [Snyk](https://snyk.io/) - Dependency vulnerability scanning
- [Helmet.js](https://helmetjs.github.io/) - Security middleware
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit) - Rate limiting

### Security Standards
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [ISO 27001](https://www.iso.org/isoiec-27001-information-security.html)

### Monitoring Services
- [Sentry](https://sentry.io/) - Error monitoring
- [LogRocket](https://logrocket.com/) - Session replay
- [DataDog](https://www.datadoghq.com/) - Application monitoring

---

**⚠️ Important**: This document should be reviewed and updated regularly to ensure compliance with current security best practices and organizational requirements.

**Last Updated**: December 2024
**Version**: 1.0 
