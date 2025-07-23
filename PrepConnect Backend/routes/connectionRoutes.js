import express from 'express';
import {
  sendConnectionRequest,
  respondToRequest,
  getPendingRequests,
  getConnections,
  getConnectionStatus,
  getSentRequests,
  cancelRequest,
  removeConnection
} from '../controllers/connectionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Send a connection request
router.post('/request', protect, sendConnectionRequest);

// Respond to a connection request (accept/reject)
router.put('/respond/:requestId', protect, respondToRequest);

// Get incoming pending requests
router.get('/pending', protect, getPendingRequests);

// Get sent pending requests
router.get('/sent', protect, getSentRequests);

// Get all accepted connections
router.get('/', protect, getConnections);

// Get connection status with a specific user
router.get('/status/:userId', protect, getConnectionStatus);

// Cancel a sent connection request
router.delete('/cancel/:requestId', protect, cancelRequest);

// Remove a connection
router.delete('/remove/:connectionId', protect, removeConnection);

export default router; 