import express from 'express';
import { sendMessage, getMessages, getConversations } from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all conversations (with connected users only)
router.get('/conversations', protect, getConversations);

// Send a message (only to connected users)
router.post('/', protect, sendMessage);

// Get chat history with a specific user (only if connected)
router.get('/:userId', protect, getMessages);

export default router; 