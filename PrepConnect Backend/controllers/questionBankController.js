import Question from '../models/Question.js';
import mongoose from 'mongoose';

// Add a new interview question
const addQuestion = async (req, res) => {
  try {
    const { content, tags, company } = req.body;
    const question = new Question({
      content,
      tags,
      company,
      user: req.user.id
    });
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all questions (optionally filter by tags/company)
const getAllQuestions = async (req, res) => {
  try {
    const { tag, company } = req.query;
    let filter = {};
    if (tag) filter.tags = tag;
    if (company) filter.company = company;
    const questions = await Question.find(filter).sort({ createdAt: -1 }).populate('user', 'name');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get question by ID
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('user', 'name');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete question (only by owner)
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    if (question.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await question.remove();
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  addQuestion,
  getAllQuestions,
  getQuestionById,
  deleteQuestion
}; 