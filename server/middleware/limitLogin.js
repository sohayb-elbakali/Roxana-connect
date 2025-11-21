const LoginAttempt = require('../models/LoginAttempt');

/**
 * Get real client IP address
 * Handles proxies, load balancers, and development environments
 */
const getClientIp = (req) => {
  // Check for forwarded IP (from proxy/load balancer)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list, get the first one
    return forwarded.split(',')[0].trim();
  }
  
  // Check for real IP header (some proxies use this)
  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'];
  }
  
  // Get IP from connection
  const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  
  // Normalize IPv6 localhost to IPv4
  if (ip === '::1' || ip === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }
  
  // Remove IPv6 prefix if present
  return ip.replace('::ffff:', '');
};

/**
 * Rate limiting middleware for login attempts
 * Blocks IP addresses after 5 failed attempts for 10 minutes
 */
const limitLogin = async (req, res, next) => {
  try {
    // Get client IP address
    const clientIp = getClientIp(req);
    
    // Find existing login attempts for this IP
    const loginAttempt = await LoginAttempt.findOne({ ip: clientIp });
    
    if (loginAttempt) {
      const timeSinceCreation = Date.now() - loginAttempt.createdAt;
      const tenMinutesInMs = 600000; // 10 minutes
      
      // Check if 10 minutes have passed - if so, delete the record and allow login
      if (timeSinceCreation >= tenMinutesInMs) {
        await LoginAttempt.deleteOne({ ip: clientIp });
        req.clientIp = clientIp;
        return next();
      }
      
      // Check if attempts exceed limit and still within 10-minute window
      if (loginAttempt.attempts >= 5) {
        const timeRemaining = Math.ceil((tenMinutesInMs - timeSinceCreation) / 1000);
        
        return res.status(429).json({
          msg: "You've entered the wrong password too many times. Please try again after 10 minutes.",
          timeRemaining: timeRemaining,
          attemptsRemaining: 0,
          blocked: true
        });
      }
      
      // Attach login attempt to request for use in route
      req.loginAttempt = loginAttempt;
      req.clientIp = clientIp;
    } else {
      req.clientIp = clientIp;
    }
    
    // Continue to login route
    next();
  } catch (err) {
    console.error('Rate limiting error:', err);
    // Don't block login if rate limiting fails
    next();
  }
};

module.exports = limitLogin;
