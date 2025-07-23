import express from 'express';
import { registerUser, loginUser, getCurrentUser, getAllUsers, createTestUsers } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Get current user (protected)
router.get('/me', protect, getCurrentUser);

// Get all users for connection suggestions (protected)
router.get('/users', protect, getAllUsers);

// Temporary route to create test users (remove in production)
router.post('/create-test-users', createTestUsers);

export default router; 