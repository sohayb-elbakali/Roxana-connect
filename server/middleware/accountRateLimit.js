const AccountLockout = require('../models/AccountLockout');

/**
 * Calculate progressive delay based on attempt count
 * 1st fail → no delay
 * 2nd → 2 seconds
 * 3rd → 5 seconds
 * 4th → 20 seconds
 * 5th+ → 2 minutes
 */
const getProgressiveDelay = (attempts) => {
    const delays = {
        1: 0,
        2: 2000,      // 2 seconds
        3: 5000,      // 5 seconds
        4: 20000,     // 20 seconds
        5: 120000     // 2 minutes
    };

    return delays[attempts] || delays[5];
};

/**
 * Get device fingerprint from request headers
 */
const getDeviceFingerprint = (req) => {
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';
    const acceptEncoding = req.headers['accept-encoding'] || '';

    // Simple fingerprint based on headers
    return Buffer.from(`${userAgent}-${acceptLanguage}-${acceptEncoding}`).toString('base64').substring(0, 50);
};

/**
 * Account-based rate limiting middleware with progressive delays
 * Locks accounts after 5 failed attempts for 15 minutes
 */
const accountRateLimit = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Skip if no email provided (will be caught by validation)
        if (!email) {
            return next();
        }

        const normalizedEmail = email.toLowerCase();
        const deviceFingerprint = getDeviceFingerprint(req);
        const userAgent = req.headers['user-agent'] || '';

        // Find existing lockout record for this email
        let lockout = await AccountLockout.findOne({ email: normalizedEmail });

        if (lockout) {
            const now = Date.now();

            // Check if account is currently locked
            if (lockout.lockedUntil && lockout.lockedUntil > now) {
                const timeRemaining = Math.ceil((lockout.lockedUntil - now) / 1000);
                const minutesRemaining = Math.ceil(timeRemaining / 60);

                return res.status(429).json({
                    msg: `Account temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''}.`,
                    timeRemaining,
                    locked: true,
                    requiresCaptcha: true
                });
            }


            // Check if we need to apply progressive delay
            // Use attempts + 1 because we're checking the delay for the NEXT attempt
            const timeSinceLastAttempt = now - new Date(lockout.lastAttempt).getTime();
            const requiredDelay = getProgressiveDelay(lockout.attempts + 1);

            if (timeSinceLastAttempt < requiredDelay) {
                const waitTime = Math.ceil((requiredDelay - timeSinceLastAttempt) / 1000);

                return res.status(429).json({
                    msg: `Too many login attempts. Please wait ${waitTime} second${waitTime > 1 ? 's' : ''} before trying again.`,
                    waitTime,
                    attemptsRemaining: Math.max(0, 5 - lockout.attempts),
                    requiresCaptcha: lockout.attempts >= 3
                });
            }

            // If lockout expired or delay passed, reset if it's been more than 15 minutes
            const fifteenMinutes = 900000;
            if (now - new Date(lockout.createdAt).getTime() > fifteenMinutes) {
                await AccountLockout.deleteOne({ email: normalizedEmail });
                lockout = null;
            }
        }

        // Attach lockout info to request for use in login route
        req.accountLockout = lockout;
        req.deviceFingerprint = deviceFingerprint;
        req.userAgent = userAgent;
        req.normalizedEmail = normalizedEmail;

        next();
    } catch (err) {
        console.error('Account rate limiting error:', err);
        // Don't block login if rate limiting fails
        next();
    }
};

/**
 * Record failed login attempt
 */
const recordFailedAttempt = async (email, deviceFingerprint, userAgent) => {
    try {
        const normalizedEmail = email.toLowerCase();
        let lockout = await AccountLockout.findOne({ email: normalizedEmail });

        if (lockout) {
            lockout.attempts += 1;
            lockout.lastAttempt = new Date();
            lockout.deviceFingerprint = deviceFingerprint;
            lockout.userAgent = userAgent;

            // Lock account after 5 failed attempts
            if (lockout.attempts >= 5) {
                lockout.lockedUntil = new Date(Date.now() + 900000); // 15 minutes
            }

            await lockout.save();
        } else {
            // Create new lockout record
            lockout = new AccountLockout({
                email: normalizedEmail,
                attempts: 1,
                lastAttempt: new Date(),
                deviceFingerprint,
                userAgent
            });

            await lockout.save();
        }

        return lockout;
    } catch (err) {
        console.error('Error recording failed attempt:', err);
        return null;
    }
};

/**
 * Clear lockout on successful login
 */
const clearLockout = async (email) => {
    try {
        const normalizedEmail = email.toLowerCase();
        await AccountLockout.deleteOne({ email: normalizedEmail });
    } catch (err) {
        console.error('Error clearing lockout:', err);
    }
};

module.exports = {
    accountRateLimit,
    recordFailedAttempt,
    clearLockout,
    getProgressiveDelay
};
