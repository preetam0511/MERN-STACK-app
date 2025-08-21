const { Ratelimit } = require('@upstash/ratelimit');
const { Redis } = require('@upstash/redis');
require('dotenv').config();

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Create a rate limiter that allows 5 requests per 60 seconds per IP
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60s'),
  analytics: true,
  prefix: 'rate-limit',
});

const rateLimiter = async (req, res, next) => {
  try {
    // Use IP address as a unique identifier
    const identifier = req.ip || 'anonymous';
    const result = await ratelimit.limit(identifier);
    
    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': result.limit,
      'X-RateLimit-Remaining': result.remaining,
      'X-RateLimit-Reset': new Date(result.reset).toISOString(),
      'Retry-After': Math.ceil((result.reset - Date.now()) / 1000)
    });

    if (!result.success) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000)
      });
    }

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    // In case of error, allow the request to proceed
    next();
  }
};

module.exports = rateLimiter;