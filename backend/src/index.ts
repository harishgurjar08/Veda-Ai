import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './services/db';
import { initSocketServer } from './services/socket';
import { initJobs } from './services/jobs';
import assignmentRoutes from './routes/assignments';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 4000;

// Enable CORS
app.use(cors({
  origin: '*', // Allow all in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/assignments', assignmentRoutes);

import { Request, Response } from 'express';

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', environment: process.env.NODE_ENV || 'development' });
});

// Start server function
async function startServer() {
  // Initialize Socket.io immediately
  initSocketServer(httpServer);
  
  // Start listening immediately to prevent frontend connection blockages (Network Error)
  httpServer.listen(PORT, () => {
    console.log(`🚀 VedaAI Backend Server running on http://localhost:${PORT}`);
  });

  // Connect to databases in the background
  connectDB().then(() => {
    // Once DB is initialized, start job worker manager in the background
    initJobs().catch(err => {
      console.error('Failed to initialize jobs runner:', err);
    });
  }).catch(err => {
    console.error('Failed to connect to database helper:', err);
  });
}

startServer().catch(err => {
  console.error('Failed to start VedaAI Backend server:', err);
});
