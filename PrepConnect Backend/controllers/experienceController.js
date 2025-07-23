import Experience from '../models/Experience.js';
import mongoose from 'mongoose';
import Journey from '../models/Journey.js';

// Create a new experience
const createExperience = async (req, res) => {
  try {
    const { title, content, tags, company, position, batch, level, interviewProcess, keyLearnings, advice } = req.body;
    const experience = new Experience({
      title,
      content,
      tags,
      company,
      position,
      batch,
      level,
      interviewProcess,
      keyLearnings,
      advice,
      user: req.user.id
    });
    await experience.save();
    res.status(201).json(experience);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all experiences (optionally filter by tags and sort by popularity/recent)
const getAllExperiences = async (req, res) => {
  try {
    const { tag, sort = 'recent' } = req.query;
    let filter = {};
    
    if (tag) {
      filter.tags = tag;
    }
    
    let experiences;
    
    // Handle sorting
    if (sort === 'popular') {
      // Sort by upvotes count (descending), then by recent
      experiences = await Experience.find(filter)
        .populate('user', 'name')
        .lean()
        .then(exps => {
          return exps.sort((a, b) => {
            const aUpvotes = a.upvotes ? a.upvotes.length : 0;
            const bUpvotes = b.upvotes ? b.upvotes.length : 0;
            if (aUpvotes !== bUpvotes) {
              return bUpvotes - aUpvotes; // Sort by upvotes descending
            }
            // If upvotes are equal, sort by date (recent first)
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        });
    } else {
      // Sort by creation date (most recent first)
      experiences = await Experience.find(filter)
        .sort({ createdAt: -1 })
        .populate('user', 'name');
    }
    
    res.json(experiences);
  } catch (err) {
    console.error('Error fetching experiences:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get experience by ID
const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id).populate('user', 'name').populate('comments.user', 'name');
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json(experience);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update experience (only by owner)
const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    if (experience.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { title, content, tags } = req.body;
    if (title !== undefined) experience.title = title;
    if (content !== undefined) experience.content = content;
    if (tags !== undefined) experience.tags = tags;
    await experience.save();
    res.json(experience);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete experience (only by owner)
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    if (experience.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await experience.remove();
    res.json({ message: 'Experience deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Upvote experience
const upvoteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    // Remove from downvotes if present
    experience.downvotes = experience.downvotes.filter(
      (userId) => userId.toString() !== req.user.id
    );
    // Add to upvotes if not already present
    if (!experience.upvotes.some((userId) => userId.toString() === req.user.id)) {
      experience.upvotes.push(req.user.id);
    }
    await experience.save();
    res.json(experience);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Downvote experience
const downvoteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    // Remove from upvotes if present
    experience.upvotes = experience.upvotes.filter(
      (userId) => userId.toString() !== req.user.id
    );
    // Add to downvotes if not already present
    if (!experience.downvotes.some((userId) => userId.toString() === req.user.id)) {
      experience.downvotes.push(req.user.id);
    }
    await experience.save();
    res.json(experience);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add comment to experience
const addComment = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    const { content } = req.body;
    const comment = {
      user: req.user.id,
      content,
      createdAt: new Date()
    };
    experience.comments.push(comment);
    await experience.save();
    res.status(201).json(experience);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all available tags
const getAllTags = async (req, res) => {
  try {
    const experiences = await Experience.find({}, 'tags');
    const allTags = new Set();
    
    experiences.forEach(exp => {
      if (exp.tags && Array.isArray(exp.tags)) {
        exp.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    res.json(Array.from(allTags).sort());
  } catch (err) {
    console.error('Error fetching tags:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new journey (experience map)
const createJourney = async (req, res) => {
  try {
    const { company, role, timeline, totalDays, successRate } = req.body;
    const journey = new Journey({
      user: req.user.id,
      company,
      role,
      timeline,
      totalDays,
      successRate
    });
    await journey.save();
    res.status(201).json(journey);
  } catch (err) {
    console.error('Error creating journey:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// Utility: Insert demo journeys if none exist
const insertDemoJourneys = async () => {
  const count = await Journey.countDocuments();
  if (count === 0) {
    await Journey.insertMany([
      {
        user: null, // Set to a valid user _id if available
        company: 'Google',
        role: 'Senior Software Engineer',
        timeline: [
          { date: '2023-01-15', title: 'Started Preparation', description: 'Began studying algorithms and data structures', icon: '📚', category: 'preparation' },
          { date: '2023-02-20', title: 'First Mock Interview', description: 'Completed first mock interview with a senior', icon: '🎤', category: 'practice' },
          { date: '2023-03-10', title: 'Applied to Google', description: 'Submitted application for Software Engineer position', icon: '📝', category: 'application' },
          { date: '2023-03-25', title: 'Phone Screen', description: 'Passed initial phone screening with recruiter', icon: '📞', category: 'interview' },
          { date: '2023-04-15', title: 'Onsite Interviews', description: 'Completed 5 rounds of onsite interviews', icon: '🏢', category: 'interview' },
          { date: '2023-04-30', title: 'Offer Received', description: 'Received and accepted offer from Google', icon: '🎉', category: 'success' }
        ],
        totalDays: 105,
        successRate: 100
      },
      {
        user: null,
        company: 'Amazon',
        role: 'Software Development Engineer',
        timeline: [
          { date: '2023-02-01', title: 'Preparation Phase', description: 'Started with system design and behavioral questions', icon: '📖', category: 'preparation' },
          { date: '2023-03-15', title: 'Mock Interviews', description: 'Completed 3 mock interviews focusing on leadership principles', icon: '🤝', category: 'practice' },
          { date: '2023-04-01', title: 'Application Submitted', description: 'Applied through Amazon careers portal', icon: '📋', category: 'application' },
          { date: '2023-04-20', title: 'Online Assessment', description: 'Completed coding assessment with 2 problems', icon: '💻', category: 'interview' },
          { date: '2023-05-10', title: 'Final Interview', description: 'Completed final round with hiring manager', icon: '🎯', category: 'interview' },
          { date: '2023-05-25', title: 'Offer Accepted', description: 'Received offer and accepted the position', icon: '✅', category: 'success' }
        ],
        totalDays: 113,
        successRate: 100
      }
    ]);
  }
};

const getAllJourneys = async (req, res) => {
  try {
    await insertDemoJourneys();
    const journeys = await Journey.find().populate('user', 'name avatar');
    res.json(journeys);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export {
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
}; 