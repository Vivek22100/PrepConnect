import MockInterview from '../models/MockInterview.js';
import mongoose from 'mongoose';

// Schedule a mock interview (junior books with senior)
const scheduleMockInterview = async (req, res) => {
  try {
    const { seniorRef, scheduledAt } = req.body;
    if (!seniorRef || !scheduledAt) {
      return res.status(400).json({ message: 'Senior and scheduled time required' });
    }
    // Prevent booking with self
    if (seniorRef === req.user.id) {
      return res.status(400).json({ message: 'Cannot book with yourself' });
    }
    const interview = new MockInterview({
      seniorRef,
      juniorRef: req.user.id,
      scheduledAt,
      status: 'pending'
    });
    await interview.save();
    res.status(201).json(interview);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all scheduled interviews for a user (as junior or senior)
const getScheduledInterviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const interviews = await MockInterview.find({
      $or: [
        { juniorRef: userId },
        { seniorRef: userId }
      ]
    }).sort({ scheduledAt: 1 }).populate('seniorRef', 'name').populate('juniorRef', 'name');
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Senior submits feedback after the session
const submitFeedback = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { feedback, status } = req.body;
    const interview = await MockInterview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Session not found' });
    }
    if (interview.seniorRef.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the senior can submit feedback' });
    }
    if (feedback !== undefined) interview.feedback = feedback;
    if (status && ['completed', 'cancelled'].includes(status)) interview.status = status;
    await interview.save();
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  scheduleMockInterview,
  getScheduledInterviews,
  submitFeedback
}; 