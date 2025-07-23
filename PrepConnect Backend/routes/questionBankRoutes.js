import express from 'express';
import {
  addQuestion,
  getAllQuestions,
  getQuestionById,
  deleteQuestion
} from '../controllers/questionBankController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Submit a new question
router.post('/', protect, addQuestion);

// Fetch all questions (filterable)
router.get('/', protect, getAllQuestions);

// Get a specific question
router.get('/:id', protect, getQuestionById);

// Delete a question (owner only)
router.delete('/:id', protect, deleteQuestion);

export default router; 