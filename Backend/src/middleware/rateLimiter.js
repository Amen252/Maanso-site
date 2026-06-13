import { rateLimit } from 'express-rate-limit';

// Global API rate limiter: protects all API endpoints from abusive traffic
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // Default to 15 minutes
  limit: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // Default to 100 requests per windowMs
  standardHeaders: 'draft-8', // draft-6/draft-7/draft-8: returns standardized rate limit info in headers
  legacyHeaders: false, // Disable the deprecated X-RateLimit-* headers
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// Auth endpoints rate limiter: stricter limits specifically for register/login/refresh/logout
export const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // Default to 15 minutes
  limit: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 15, // Default to 15 requests per windowMs
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
  },
});
