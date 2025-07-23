import express from 'express';
import {
  scheduleMockInterview,
  getScheduledInterviews,
  submitFeedback
} from '../controllers/mockInterviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Schedule a new mock interview
router.post('/', protect, scheduleMockInterview);

// Fetch mock interviews for current user
router.get('/', protect, getScheduledInterviews);

// Submit feedback after session
router.post('/:interviewId/feedback', protect, submitFeedback);

export default router; 