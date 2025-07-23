import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [experience, setExperience] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('none'); // none, pending, accepted, rejected
  const [isInitiator, setIsInitiator] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [upvoting, setUpvoting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchExperienceDetails();
    }
  }, [id]);

  useEffect(() => {
    if (experience && user) {
      fetchConnectionStatus();
    }
  }, [experience, user]);

  const fetchExperienceDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/experiences/${id}`);
      if (response.ok) {
        const data = await response.json();
        setExperience(data);
        setAuthor(data.user);
      } else {
        console.error('Failed to fetch experience');
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectionStatus = async () => {
    if (!user || !experience) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/connections/status/${experience.user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus(data.status);
        setIsInitiator(data.isInitiator);
      }
    } catch (error) {
      console.error('Error fetching connection status:', error);
    }
  };

  const handleConnect = async () => {
    if (!user) {
      alert('Please login to connect with users');
      return;
    }

    if (user.id === experience.user._id || user._id === experience.user._id) {
      alert('You cannot connect with yourself');
      return;
    }

    setConnecting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/connections/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ toUser: experience.user._id })
      });

      if (response.ok) {
        alert('Connection request sent successfully!');
        setConnectionStatus('pending');
        setIsInitiator(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to send connection request');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Error sending connection request');
    } finally {
      setConnecting(false);
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      alert('Please login to upvote experiences');
      return;
    }

    setUpvoting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/experiences/${id}/upvote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedExperience = await response.json();
        setExperience(updatedExperience);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to upvote');
      }
    } catch (error) {
      console.error('Error upvoting:', error);
      alert('Error upvoting experience');
    } finally {
      setUpvoting(false);
    }
  };

  const handleChat = () => {
    if (connectionStatus === 'accepted') {
      navigate('/chat');
    } else {
      alert('You need to be connected with this user to chat. Send a connection request first.');
    }
  };

  const getConnectionButtonText = () => {
    switch (connectionStatus) {
      case 'none':
        return 'Connect';
      case 'pending':
        return isInitiator ? 'Request Sent' : 'Respond to Request';
      case 'accepted':
        return 'Connected';
      case 'rejected':
        return 'Connect Again';
      default:
        return 'Connect';
    }
  };

  const getConnectionButtonClass = () => {
    switch (connectionStatus) {
      case 'none':
      case 'rejected':
        return 'btn-connect';
      case 'pending':
        return isInitiator ? 'btn-pending' : 'btn-respond';
      case 'accepted':
        return 'btn-connected';
      default:
        return 'btn-connect';
    }
  };

  const isConnectionDisabled = () => {
    return connecting || connectionStatus === 'pending' || connectionStatus === 'accepted';
  };

  // Helper to check if user has upvoted
  const hasUpvoted = experience && user && Array.isArray(experience.upvotes) && experience.upvotes.some(u => (u._id || u) === (user.id || user._id));

  if (loading) {
    return (
      <div className="experience-details-page">
        <div className="loading">Loading experience details...</div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="experience-details-page">
        <div className="error">Experience not found</div>
      </div>
    );
  }

  return (
    <div className="experience-details-page">
      <div className="container">
        {/* Header */}
        <div className="experience-header">
          <div className="header-content">
            <h1>{experience.title}</h1>
            <div className="experience-meta">
              <div className="author-info">
                <div className="author-avatar">
                  {author?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="author-details">
                  <span className="author-name">{author?.name || 'Unknown User'}</span>
                  <span className="author-role">{author?.role || 'Developer'}</span>
                </div>
              </div>
              <div className="experience-stats">
                <span className="date">{new Date(experience.createdAt).toLocaleDateString()}</span>
                <span className="upvotes">{Array.isArray(experience.upvotes) ? experience.upvotes.length : 0} upvotes</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className={`btn ${getConnectionButtonClass()}`}
              onClick={handleConnect}
              disabled={isConnectionDisabled()}
            >
              {connecting ? 'Connecting...' : getConnectionButtonText()}
            </button>
            
            {connectionStatus === 'accepted' && (
              <button 
                className="btn btn-chat"
                onClick={handleChat}
              >
                Chat
              </button>
            )}
            
            <button 
              className={`btn btn-upvote${hasUpvoted ? ' upvoted' : ''}`}
              onClick={handleUpvote}
              disabled={true}
            >
              {upvoting ? 'Upvoting...' : '👍 Upvote'}
              <span style={{ marginLeft: '8px' }}>{Array.isArray(experience.upvotes) ? experience.upvotes.length : 0}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="experience-content">
          <div className="content-section">
            <h2>Experience Details</h2>
            <p className="description">{experience.description}</p>
          </div>

          <div className="content-section">
            <h2>Company & Role</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Company:</span>
                <span className="value">{experience.company}</span>
              </div>
              <div className="detail-item">
                <span className="label">Position:</span>
                <span className="value">{experience.position}</span>
              </div>
              <div className="detail-item">
                <span className="label">Experience Level:</span>
                <span className="value">{experience.level}</span>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2>Interview Process</h2>
            <p>{experience.interviewProcess}</p>
          </div>

          <div className="content-section">
            <h2>Key Learnings</h2>
            <p>{experience.keyLearnings}</p>
          </div>

          {experience.tags && experience.tags.length > 0 && (
            <div className="content-section">
              <h2>Tags</h2>
              <div className="tags">
                {experience.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          <div className="content-section">
            <h2>Advice for Others</h2>
            <p>{experience.advice}</p>
          </div>
        </div>
      </div>

      <style>{`
        .experience-details-page {
          min-height: 80vh;
          background: #f7fafc;
          padding: 2rem 1rem;
        }
        .container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .experience-header {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header-content h1 {
          color: #2d3748;
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }
        .experience-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .author-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .author-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #3182ce;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.2rem;
        }
        .author-details {
          display: flex;
          flex-direction: column;
        }
        .author-name {
          font-weight: 600;
          color: #2d3748;
          font-size: 1.1rem;
        }
        .author-role {
          color: #718096;
          font-size: 0.9rem;
        }
        .experience-stats {
          display: flex;
          gap: 1rem;
          color: #718096;
          font-size: 0.9rem;
        }
        .action-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-connect {
          background: #3182ce;
          color: white;
        }
        .btn-connect:hover:not(:disabled) {
          background: #2c5aa0;
        }
        .btn-pending {
          background: #ed8936;
          color: white;
        }
        .btn-respond {
          background: #48bb78;
          color: white;
        }
        .btn-connected {
          background: #48bb78;
          color: white;
        }
        .btn-chat {
          background: #805ad5;
          color: white;
        }
        .btn-chat:hover:not(:disabled) {
          background: #6b46c1;
        }
        .btn-upvote {
          background: #f56565;
          color: white;
        }
        .btn-upvote:hover:not(:disabled) {
          background: #e53e3e;
        }
        .btn-upvote.upvoted {
          background: #48bb78;
          color: #fff;
          border-color: #48bb78;
        }
        .experience-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .content-section {
          margin-bottom: 2rem;
        }
        .content-section:last-child {
          margin-bottom: 0;
        }
        .content-section h2 {
          color: #2d3748;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }
        .description {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #4a5568;
          margin-bottom: 1rem;
        }
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f7fafc;
          border-radius: 6px;
        }
        .label {
          font-weight: 600;
          color: #4a5568;
        }
        .value {
          color: #2d3748;
        }
        .content-section p {
          line-height: 1.6;
          color: #4a5568;
          margin-bottom: 1rem;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .tag {
          background: #e2e8f0;
          color: #4a5568;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .loading, .error {
          text-align: center;
          padding: 3rem;
          color: #4a5568;
          font-size: 1.1rem;
        }
        @media (max-width: 768px) {
          .experience-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .action-buttons {
            flex-direction: column;
          }
          .details-grid {
            grid-template-columns: 1fr;
          }
          .header-content h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ExperienceDetails; 