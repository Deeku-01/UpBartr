// app.ts (your main Express app file)

import express from 'express';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import skillsRoutes from './routes/application';
import skillreqRouter from './routes/skillrequests';
import conversationRoutes from './routes/conversations'; // NEW: Import conversation routes

// Import middleware
import { authenticateToken } from './middleware/authMiddleware';

const app = express();
app.use(express.json());

app.use(cors());

// Routes
app.use('/api/skillreqs', skillreqRouter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillsRoutes); // Applications routes
app.use('/api/conversations', authenticateToken, conversationRoutes); // NEW: Register conversation routes
// Note: `authenticateToken` is applied here so all conversation routes are protected.


// 404 handler
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome !!' });
});

export default app;