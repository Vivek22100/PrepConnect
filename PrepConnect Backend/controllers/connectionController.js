import Connection from '../models/Connection.js';
import mongoose from 'mongoose';

// Send a connection request
const sendConnectionRequest = async (req, res) => {
  try {
    const { toUser } = req.body;
    
    if (!toUser) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    if (toUser === req.user.id) {
      return res.status(400).json({ message: 'Cannot connect to yourself' });
    }
    
    // Check for existing connection (any status)
    const existing = await Connection.findOne({
      $or: [
        { fromUser: req.user.id, toUser },
        { fromUser: toUser, toUser: req.user.id }
      ]
    });
    
    if (existing) {
      if (existing.status === 'pending') {
        return res.status(400).json({ message: 'Connection request already pending' });
      } else if (existing.status === 'accepted') {
        return res.status(400).json({ message: 'Already connected with this user' });
      } else if (existing.status === 'rejected') {
        // Allow sending a new request if previous was rejected
        existing.status = 'pending';
        existing.fromUser = req.user.id;
        existing.toUser = toUser;
        existing.createdAt = new Date();
        await existing.save();
        return res.status(201).json(existing);
      }
    }
    
    const connection = new Connection({
      fromUser: req.user.id,
      toUser,
      status: 'pending'
    });
    await connection.save();
    
    // Populate user details for response
    await connection.populate('fromUser', 'name email role');
    await connection.populate('toUser', 'name email role');
    
    res.status(201).json(connection);
  } catch (err) {
    console.error('Error sending connection request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Respond to a connection request (accept/reject)
const respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // 'accepted' or 'rejected'
    
    if (!['accepted', 'rejected'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Must be "accepted" or "rejected"' });
    }
    
    const connection = await Connection.findById(requestId);
    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }
    
    if (connection.toUser.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to respond to this request' });
    }
    
    if (connection.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }
    
    connection.status = action;
    await connection.save();
    
    // Populate user details for response
    await connection.populate('fromUser', 'name email role');
    await connection.populate('toUser', 'name email role');
    
    res.json({
      message: `Connection request ${action}`,
      connection
    });
  } catch (err) {
    console.error('Error responding to connection request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get pending incoming connection requests
const getPendingRequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      toUser: req.user.id,
      status: 'pending'
    }).populate('fromUser', 'name email role');
    
    res.json(requests);
  } catch (err) {
    console.error('Error fetching pending requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all accepted connections for a user
const getConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    const connections = await Connection.find({
      status: 'accepted',
      $or: [
        { fromUser: userId },
        { toUser: userId }
      ]
    }).populate('fromUser', 'name email role').populate('toUser', 'name email role');
    
    res.json(connections);
  } catch (err) {
    console.error('Error fetching connections:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get connection status with a specific user
const getConnectionStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot check connection with yourself' });
    }
    
    const connection = await Connection.findOne({
      $or: [
        { fromUser: req.user.id, toUser: userId },
        { fromUser: userId, toUser: req.user.id }
      ]
    });
    
    if (!connection) {
      return res.json({ status: 'none', connection: null });
    }
    
    res.json({ 
      status: connection.status, 
      connection,
      isInitiator: connection.fromUser.toString() === req.user.id
    });
  } catch (err) {
    console.error('Error fetching connection status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get sent connection requests
const getSentRequests = async (req, res) => {
  try {
    const requests = await Connection.find({
      fromUser: req.user.id,
      status: 'pending'
    }).populate('toUser', 'name email role');
    
    res.json(requests);
  } catch (err) {
    console.error('Error fetching sent requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel a sent connection request
const cancelRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const connection = await Connection.findById(requestId);
    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }
    
    if (connection.fromUser.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to cancel this request' });
    }
    
    if (connection.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }
    
    await Connection.findByIdAndDelete(requestId);
    
    res.json({ message: 'Connection request cancelled' });
  } catch (err) {
    console.error('Error cancelling connection request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a connection
const removeConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    
    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }
    
    if (connection.status !== 'accepted') {
      return res.status(400).json({ message: 'Can only remove accepted connections' });
    }
    
    if (connection.fromUser.toString() !== req.user.id && connection.toUser.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to remove this connection' });
    }
    
    await Connection.findByIdAndDelete(connectionId);
    
    res.json({ message: 'Connection removed' });
  } catch (err) {
    console.error('Error removing connection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  sendConnectionRequest,
  respondToRequest,
  getPendingRequests,
  getConnections,
  getConnectionStatus,
  getSentRequests,
  cancelRequest,
  removeConnection
}; 