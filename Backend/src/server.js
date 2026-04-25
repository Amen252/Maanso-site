import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './config/db.js';
import gabayRoutes from './modules/Gabay/gabay.routes.js';
import authRoutes from './modules/auth/auth.route.js';
import userRoutes from './modules/users/user.routes.js';

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gabays', gabayRoutes);
app.use('/api/users', userRoutes);

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
