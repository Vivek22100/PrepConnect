import express from 'express';
import {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  upvoteExperience,
  downvoteExperience,
  addComment,
  getAllTags,
  createJourney,
  getAllJourneys
} from '../controllers/experienceController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all available tags
router.get('/tags', getAllTags);

// Create a new experience (protected)
router.post('/', protect, createExperience);

// Get all experiences
router.get('/', getAllExperiences);

// Get specific experience
router.get('/:id', getExperienceById);

// Update experience (owner only, protected)
router.put('/:id', protect, updateExperience);

// Delete experience (owner only, protected)
router.delete('/:id', protect, deleteExperience);

// Upvote (protected)
router.put('/:id/upvote', protect, upvoteExperience);

// Downvote (protected)
router.put('/:id/downvote', protect, downvoteExperience);

// Add comment (protected)
router.post('/:id/comments', protect, addComment);

router.post('/journeys', protect, createJourney);
router.get('/journeys', getAllJourneys);

export default router; 