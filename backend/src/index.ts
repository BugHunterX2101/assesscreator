import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db';
import { wsService } from './services/websocket.service';
import { startWorker } from './workers/generation.worker';

import assignmentsRoutes from './routes/assignments.routes';
import paperRoutes from './routes/paper.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to DB
connectDB();

// Initialize WebSockets
wsService.init(server);

// Start BullMQ Worker
startWorker();

// Middlewares
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000'
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100')
});
app.use('/api', limiter);

// Routes
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/assignments', paperRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
