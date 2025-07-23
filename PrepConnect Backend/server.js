import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import mockInterviewRoutes from './routes/mockInterviewRoutes.js';
import questionBankRoutes from './routes/questionBankRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import { setSocketIO } from './controllers/messageController.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/mock-interviews', mockInterviewRoutes);
app.use('/api/questions', questionBankRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Set socket.io instance in message controller
setSocketIO(io);

// Socket.io basic setup
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 