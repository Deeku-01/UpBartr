import express from 'express';
import cors from 'cors';


// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import skillsRoutes from './routes/skills';
import exchangeRoutes from './routes/exchange';

// // Import middleware
// import { errorHandler } from './middleware/error.middleware';

const app = express();
app.use(express.json());

// Security middleware

// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));
app.use(cors());



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/exchanges', exchangeRoutes);

// // Error handling
// app.use(errorHandler);

// 404 handler
app.use('/', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;