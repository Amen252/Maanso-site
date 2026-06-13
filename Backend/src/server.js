import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './config/db.js';
import gabayRoutes from './Features/Gabay/gabay.routes.js';
import authRoutes from './Features/auth/auth.route.js';
import userRoutes from './Features/users/user.routes.js';
import adminRoutes from './Features/admin/admin.routes.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';

const app = express();

// Enable if behind a reverse proxy (Heroku, Nginx, Cloudflare, etc.) to get correct client IP
app.set('trust proxy', 1);

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting
app.use('/api', apiLimiter); // Overall API limit
app.use('/api/auth', authLimiter); // Stricter Auth limit

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gabays', gabayRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Maanso Poetry Site API" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
