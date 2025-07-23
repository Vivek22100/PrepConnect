import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Registering  a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user (protected route)
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users for connection suggestions (excluding current user)
const getAllUsers = async (req, res) => {
  try {
    console.log('Getting all users, excluding user ID:', req.user.id);
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('name email role')
      .sort({ name: 1 });
    console.log('Found users:', users.length, users.map(u => ({ name: u.name, email: u.email })));
    res.json(users);
  } catch (err) {
    console.error('Error getting all users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Temporary function to create test users (remove in production)
const createTestUsers = async (req, res) => {
  try {
    const testUsers = [
      { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'senior' },
      { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'senior' },
      { name: 'Bob Johnson', email: 'bob@example.com', password: 'password123', role: 'junior' },
      { name: 'Alice Brown', email: 'alice@example.com', password: 'password123', role: 'senior' },
      { name: 'Charlie Wilson', email: 'charlie@example.com', password: 'password123', role: 'junior' }
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role
        });
        await user.save();
        createdUsers.push({ name: user.name, email: user.email, role: user.role });
      }
    }

    res.json({ 
      message: `Created ${createdUsers.length} test users`,
      users: createdUsers 
    });
  } catch (err) {
    console.error('Error creating test users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  createTestUsers
}; 