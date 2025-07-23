import Message from '../models/Message.js';
import Connection from '../models/Connection.js';
import mongoose from 'mongoose';

// Global variable to store socket.io instance
let io;

// Function to set socket.io instance
export const setSocketIO = (socketIO) => {
  io = socketIO;
};

// Send a new message (only to connected users)
const sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;
    
    if (!receiver || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }
    
    // Check if users are connected
    const connection = await Connection.findOne({
      status: 'accepted',
      $or: [
        { fromUser: req.user.id, toUser: receiver },
        { fromUser: receiver, toUser: req.user.id }
      ]
    });
    
    if (!connection) {
      return res.status(403).json({ 
        message: 'You can only send messages to connected users. Send a connection request first.' 
      });
    }
    
    const message = new Message({
      sender: req.user.id,
      receiver,
      content
    });
    await message.save();
    
    // Populate sender and receiver details
    await message.populate('sender', 'name');
    await message.populate('receiver', 'name');
    
    // Emit real-time message to receiver if socket.io is available
    if (io) {
      io.to(receiver.toString()).emit('receiveMessage', message);
    }
    
    res.status(201).json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get message history between two users (only if connected)
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params; // The other user's ID
    const myId = req.user.id;
    
    // Check if users are connected
    const connection = await Connection.findOne({
      status: 'accepted',
      $or: [
        { fromUser: myId, toUser: userId },
        { fromUser: userId, toUser: myId }
      ]
    });
    
    if (!connection) {
      return res.status(403).json({ 
        message: 'You can only view messages with connected users' 
      });
    }
    
    // Find messages where (sender=myId and receiver=userId) or (sender=userId and receiver=myId)
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId }
      ]
    })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all conversations for a user (with connected users only)
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all accepted connections
    const connections = await Connection.find({
      status: 'accepted',
      $or: [
        { fromUser: userId },
        { toUser: userId }
      ]
    }).populate('fromUser', 'name email role').populate('toUser', 'name email role');
    
    // Get the other user from each connection
    const connectedUsers = connections.map(conn => {
      const otherUser = conn.fromUser._id.toString() === userId ? conn.toUser : conn.fromUser;
      return {
        userId: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
        role: otherUser.role,
        connectionId: conn._id
      };
    });
    
    // Get latest message for each conversation
    const conversationsWithMessages = await Promise.all(
      connectedUsers.map(async (user) => {
        const latestMessage = await Message.findOne({
          $or: [
            { sender: userId, receiver: user.userId },
            { sender: user.userId, receiver: userId }
          ]
        })
        .sort({ timestamp: -1 })
        .populate('sender', 'name')
        .populate('receiver', 'name');
        
        return {
          ...user,
          latestMessage: latestMessage ? {
            content: latestMessage.content,
            timestamp: latestMessage.timestamp,
            isOwn: latestMessage.sender._id.toString() === userId
          } : null
        };
      })
    );
    
    // Sort by latest message timestamp
    conversationsWithMessages.sort((a, b) => {
      if (!a.latestMessage && !b.latestMessage) return 0;
      if (!a.latestMessage) return 1;
      if (!b.latestMessage) return -1;
      return new Date(b.latestMessage.timestamp) - new Date(a.latestMessage.timestamp);
    });
    
    res.json(conversationsWithMessages);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  sendMessage,
  getMessages,
  getConversations
}; 