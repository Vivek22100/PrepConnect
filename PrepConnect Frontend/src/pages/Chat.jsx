import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Auto-select user if mentorId/userId is present in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mentorId = params.get('mentorId') || params.get('userId');
    if (mentorId && conversations.length > 0) {
      const found = conversations.find(c => c.userId === mentorId);
      if (found) setSelectedUser(found);
    }
  }, [location.search, conversations]);

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      // Join user's room for receiving messages
      newSocket.emit('join', user.id || user._id);

      // Listen for incoming messages
      newSocket.on('receiveMessage', (message) => {
        // Normalize sender/receiver to always be objects with _id
        if (typeof message.sender === 'string') {
          message.sender = { _id: message.sender };
        }
        if (typeof message.receiver === 'string') {
          message.receiver = { _id: message.receiver };
        }
        setMessages(prev => [...prev, message]);
        fetchConversations();
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  // Fetch conversations on component mount
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.userId);
    }
  }, [selectedUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        console.error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Failed to fetch messages');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver: selectedUser.userId,
          content: newMessage
        })
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
        
        // Refresh conversations to update latest message
        await fetchConversations();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatLatestMessage = (message) => {
    if (!message) return 'No messages yet';
    const content = message.content.length > 30 
      ? message.content.substring(0, 30) + '...' 
      : message.content;
    return message.isOwn ? `You: ${content}` : content;
  };

  if (!user) {
    return (
      <div className="chat-page">
        <div className="no-auth">
          <h3>Please login to access chat</h3>
          <p>You need to be logged in to chat with your connections</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Sidebar - Connected Users */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>Chat with Connections</h2>
            <div className="connections-count">
              {conversations.length} connection{conversations.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {loading ? (
            <div className="loading">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="no-connections">
              <p>No connections yet</p>
              <p>Connect with other users to start chatting</p>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  className={`conversation-item ${selectedUser?.userId === conversation.userId ? 'active' : ''}`}
                  onClick={() => setSelectedUser(conversation)}
                >
                  <div className="user-avatar">
                    <div className="avatar-placeholder">
                      {conversation.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <div className="user-name">{conversation.name}</div>
                      {conversation.latestMessage && (
                        <div className="message-time">
                          {formatTime(conversation.latestMessage.timestamp)}
                        </div>
                      )}
                    </div>
                    <div className="latest-message">
                      {formatLatestMessage(conversation.latestMessage)}
                    </div>
                    <div className="user-role">{conversation.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="chat-main">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="chat-avatar">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{selectedUser.name}</h3>
                    <span className="user-role">{selectedUser.role}</span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>No messages yet</p>
                    <p>Start the conversation!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
                      const isOwnMessage = senderId === user.id || senderId === user._id;
                      const showDate = index === 0 || 
                        formatDate(message.timestamp) !== formatDate(messages[index - 1]?.timestamp);
                      
                      return (
                        <div key={message._id}>
                          {showDate && (
                            <div className="date-divider">
                              {formatDate(message.timestamp)}
                            </div>
                          )}
                          <div className={`message ${isOwnMessage ? 'own' : 'other'}`}>
                            <div className="message-content">
                              <p>{message.content}</p>
                              <span className="message-time">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="message-input-container">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="message-input"
                  disabled={sending}
                />
                <button 
                  onClick={handleSendMessage} 
                  className="send-button"
                  disabled={sending || !newMessage.trim()}
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-content">
                <h3>Select a connection to start chatting</h3>
                <p>Choose from your connected users to begin a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .chat-page {
          height: calc(100vh - 120px);
          background: #f7fafc;
          padding: 1rem;
        }
        .chat-container {
          display: flex;
          height: 100%;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .chat-sidebar {
          width: 350px;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
        }
        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .sidebar-header h2 {
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 1.3rem;
        }
        .connections-count {
          color: #718096;
          font-size: 0.9rem;
        }
        .loading, .no-connections, .no-auth {
          padding: 2rem;
          text-align: center;
          color: #718096;
        }
        .no-connections p, .no-auth p {
          margin: 0.5rem 0;
        }
        .conversations-list {
          flex: 1;
          overflow-y: auto;
        }
        .conversation-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #f7fafc;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .conversation-item:hover {
          background-color: #f7fafc;
        }
        .conversation-item.active {
          background-color: #ebf8ff;
          border-left: 3px solid #3182ce;
        }
        .user-avatar {
          margin-right: 1rem;
        }
        .avatar-placeholder, .chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #3182ce;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
        }
        .conversation-info {
          flex: 1;
          min-width: 0;
        }
        .conversation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        .user-name {
          font-weight: 600;
          color: #2d3748;
          font-size: 0.95rem;
        }
        .message-time {
          color: #a0aec0;
          font-size: 0.8rem;
        }
        .latest-message {
          color: #4a5568;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-role {
          color: #718096;
          font-size: 0.8rem;
        }
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .chat-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        .chat-user-info {
          display: flex;
          align-items: center;
        }
        .chat-avatar {
          margin-right: 1rem;
        }
        .chat-user-info h3 {
          margin: 0 0 0.25rem 0;
          color: #2d3748;
        }
        .messages-container {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          background: #f8fafc;
        }
        .no-messages {
          text-align: center;
          color: #718096;
          padding: 2rem;
        }
        .date-divider {
          text-align: center;
          margin: 1rem 0;
          color: #a0aec0;
          font-size: 0.8rem;
        }
        .message {
          margin-bottom: 1rem;
          display: flex;
        }
        .message.own {
          justify-content: flex-end;
        }
        .message-content {
          max-width: 70%;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          position: relative;
        }
        .message.own .message-content {
          background: #3182ce;
          color: white;
        }
        .message.other .message-content {
          background: white;
          color: #2d3748;
          border: 1px solid #e2e8f0;
        }
        .message-content p {
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }
        .message-time {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        .message-input-container {
          padding: 1.5rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 0.5rem;
        }
        .message-input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
        }
        .message-input:focus {
          border-color: #3182ce;
        }
        .message-input:disabled {
          background: #f7fafc;
          cursor: not-allowed;
        }
        .send-button {
          padding: 0.75rem 1.5rem;
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }
        .send-button:hover:not(:disabled) {
          background: #2c5aa0;
        }
        .send-button:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }
        .no-chat-selected {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }
        .no-chat-content {
          text-align: center;
          color: #718096;
        }
        .no-chat-content h3 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        @media (max-width: 768px) {
          .chat-container {
            flex-direction: column;
          }
          .chat-sidebar {
            width: 100%;
            height: 200px;
          }
          .conversation-item {
            padding: 0.75rem;
          }
          .message-content {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
};

export default Chat; 