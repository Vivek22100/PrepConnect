import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Connect = () => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('suggestions'); // suggestions, pending, sent, connections
  const [connecting, setConnecting] = useState({});
  const [responding, setResponding] = useState({});
  const [cancelling, setCancelling] = useState({});
  const [removing, setRemoving] = useState({});

  // Fetch all data on component mount
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPendingRequests(),
        fetchSentRequests(),
        fetchSuggestedUsers(),
        fetchAcceptedConnections()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/connections/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/connections/sent', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSentRequests(data);
      }
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSuggestedUsers(data);
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const fetchAcceptedConnections = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/connections', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAcceptedConnections(data);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const handleConnect = async (userId) => {
    if (!user) {
      alert('Please login to connect with users');
      return;
    }

    setConnecting(prev => ({ ...prev, [userId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/connections/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ toUser: userId })
      });

      if (response.ok) {
        alert('Connection request sent successfully!');
        // Refresh data
        await Promise.all([fetchSentRequests(), fetchSuggestedUsers()]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to send connection request');
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Error sending connection request');
    } finally {
      setConnecting(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleAccept = async (requestId) => {
    setResponding(prev => ({ ...prev, [requestId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/connections/respond/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action: 'accepted'
        })
      });

      if (response.ok) {
        alert('Connection accepted!');
        // Refresh data
        await fetchAllData();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to accept connection');
      }
    } catch (error) {
      console.error('Error accepting connection:', error);
      alert('Error accepting connection');
    } finally {
      setResponding(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleDeny = async (requestId) => {
    setResponding(prev => ({ ...prev, [requestId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/connections/respond/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action: 'rejected'
        })
      });

      if (response.ok) {
        alert('Connection request denied');
        // Refresh pending requests
        await fetchPendingRequests();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to deny connection');
      }
    } catch (error) {
      console.error('Error denying connection:', error);
      alert('Error denying connection');
    } finally {
      setResponding(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleCancelRequest = async (requestId) => {
    setCancelling(prev => ({ ...prev, [requestId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/connections/cancel/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Connection request cancelled');
        await fetchSentRequests();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to cancel request');
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Error cancelling request');
    } finally {
      setCancelling(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) {
      return;
    }

    setRemoving(prev => ({ ...prev, [connectionId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/connections/remove/${connectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Connection removed');
        await fetchAcceptedConnections();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to remove connection');
      }
    } catch (error) {
      console.error('Error removing connection:', error);
      alert('Error removing connection');
    } finally {
      setRemoving(prev => ({ ...prev, [connectionId]: false }));
    }
  };

  const handleMessage = (connection) => {
    // Navigate to chat page with the connection
    console.log('Open chat with:', connection);
    alert('Chat functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="connect-page">
        <div className="loading">Loading connections...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="connect-page">
        <div className="container">
          <div className="connect-header">
            <h1>Connect with Professionals</h1>
            <p className="subtitle">Build your network and learn from experienced developers</p>
          </div>
          <div className="section">
            <div className="empty-state">
              <p>Please login to view and manage your connections</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="connect-page">
      <div className="container">
        <div className="connect-header">
          <h1>Connect with Professionals</h1>
          <p className="subtitle">Build your network and learn from experienced developers</p>
          <div className="header-actions">
            <a href="/profiles" className="btn btn-secondary">
              View All User Profiles
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            Suggestions ({suggestedUsers.length})
          </button>
          <button 
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({pendingRequests.length})
          </button>
          <button 
            className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent ({sentRequests.length})
          </button>
          <button 
            className={`tab ${activeTab === 'connections' ? 'active' : ''}`}
            onClick={() => setActiveTab('connections')}
          >
            Connections ({acceptedConnections.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="section">
              <h2>Suggested Connections</h2>
              {suggestedUsers.length === 0 ? (
                <div className="empty-state">
                  <p>No suggested users available</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                    This might be because there are no other users in the system yet, 
                    or you're already connected with everyone.
                  </p>
                </div>
              ) : (
                <div className="cards-grid">
                  {suggestedUsers.map((suggestedUser) => (
                    <div key={suggestedUser._id} className="card">
                      <div className="card-content">
                        <h3>{suggestedUser.name}</h3>
                        <p className="role">{suggestedUser.role || 'Developer'}</p>
                        <p className="email">{suggestedUser.email}</p>
                      </div>
                      <div className="card-actions">
                        <button 
                          className="btn btn-connect" 
                          onClick={() => handleConnect(suggestedUser._id)}
                          disabled={connecting[suggestedUser._id]}
                        >
                          {connecting[suggestedUser._id] ? 'Connecting...' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pending Requests Tab */}
          {activeTab === 'pending' && (
            <div className="section">
              <h2>Pending Connection Requests</h2>
              {pendingRequests.length === 0 ? (
                <div className="empty-state">
                  <p>No pending connection requests</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {pendingRequests.map((request) => (
                    <div key={request._id} className="card">
                      <div className="card-content">
                        <h3>{request.fromUser?.name || 'Unknown User'}</h3>
                        <p className="role">{request.fromUser?.role || 'Developer'}</p>
                        <p className="email">{request.fromUser?.email}</p>
                        <p className="date">Requested: {new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="card-actions">
                        <button 
                          className="btn btn-accept" 
                          onClick={() => handleAccept(request._id)}
                          disabled={responding[request._id]}
                        >
                          {responding[request._id] ? 'Accepting...' : 'Accept'}
                        </button>
                        <button 
                          className="btn btn-deny" 
                          onClick={() => handleDeny(request._id)}
                          disabled={responding[request._id]}
                        >
                          {responding[request._id] ? 'Denying...' : 'Deny'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sent Requests Tab */}
          {activeTab === 'sent' && (
            <div className="section">
              <h2>Sent Connection Requests</h2>
              {sentRequests.length === 0 ? (
                <div className="empty-state">
                  <p>No sent connection requests</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {sentRequests.map((request) => (
                    <div key={request._id} className="card">
                      <div className="card-content">
                        <h3>{request.toUser?.name || 'Unknown User'}</h3>
                        <p className="role">{request.toUser?.role || 'Developer'}</p>
                        <p className="email">{request.toUser?.email}</p>
                        <p className="date">Sent: {new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="card-actions">
                        <button 
                          className="btn btn-cancel" 
                          onClick={() => handleCancelRequest(request._id)}
                          disabled={cancelling[request._id]}
                        >
                          {cancelling[request._id] ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Connections Tab */}
          {activeTab === 'connections' && (
            <div className="section">
              <h2>Your Connections</h2>
              {acceptedConnections.length === 0 ? (
                <div className="empty-state">
                  <p>No connections yet. Start connecting with other professionals!</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {acceptedConnections.map((connection) => {
                    const otherUser = connection.fromUser?._id === user?.id || connection.fromUser?._id === user?._id
                      ? connection.toUser 
                      : connection.fromUser;
                    
                    return (
                      <div key={connection._id} className="card">
                        <div className="card-content">
                          <h3>{otherUser?.name || 'Unknown User'}</h3>
                          <p className="role">{otherUser?.role || 'Developer'}</p>
                          <p className="email">{otherUser?.email}</p>
                          <p className="date">Connected: {new Date(connection.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="card-actions">
                          <button 
                            className="btn btn-message" 
                            onClick={() => handleMessage(connection)}
                          >
                            Message
                          </button>
                          <button 
                            className="btn btn-remove" 
                            onClick={() => handleRemoveConnection(connection._id)}
                            disabled={removing[connection._id]}
                          >
                            {removing[connection._id] ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .connect-page {
          min-height: 80vh;
          background: #f7fafc;
          padding: 2rem 1rem;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .connect-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .connect-header h1 {
          color: #3182ce;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .subtitle {
          color: #4a5568;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }
        .header-actions {
          margin-top: 1rem;
        }
        .btn-secondary {
          background: #718096;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
          display: inline-block;
        }
        .btn-secondary:hover {
          background: #4a5568;
        }
        .tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: white;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .tab {
          padding: 0.75rem 1.5rem;
          border: none;
          background: #f7fafc;
          color: #4a5568;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        .tab:hover {
          background: #edf2f7;
        }
        .tab.active {
          background: #3182ce;
          color: white;
        }
        .section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .section h2 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .card-content h3 {
          margin: 0 0 0.5rem 0;
          color: #2d3748;
          font-size: 1.2rem;
        }
        .role {
          color: #4a5568;
          margin: 0.25rem 0;
          font-weight: 500;
        }
        .email {
          color: #718096;
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }
        .date {
          color: #a0aec0;
          margin: 0.25rem 0;
          font-size: 0.8rem;
        }
        .card-actions {
          margin-top: 1rem;
          display: flex;
          gap: 0.5rem;
        }
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
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
        .btn-accept {
          background: #48bb78;
          color: white;
        }
        .btn-accept:hover:not(:disabled) {
          background: #38a169;
        }
        .btn-deny {
          background: #f56565;
          color: white;
        }
        .btn-deny:hover:not(:disabled) {
          background: #e53e3e;
        }
        .btn-connect {
          background: #3182ce;
          color: white;
        }
        .btn-connect:hover:not(:disabled) {
          background: #2c5aa0;
        }
        .btn-message {
          background: #805ad5;
          color: white;
        }
        .btn-message:hover:not(:disabled) {
          background: #6b46c1;
        }
        .btn-cancel {
          background: #ed8936;
          color: white;
        }
        .btn-cancel:hover:not(:disabled) {
          background: #dd6b20;
        }
        .btn-remove {
          background: #e53e3e;
          color: white;
        }
        .btn-remove:hover:not(:disabled) {
          background: #c53030;
        }
        .empty-state {
          text-align: center;
          color: #718096;
          font-style: italic;
          padding: 2rem;
        }
        .loading {
          text-align: center;
          padding: 3rem;
          color: #4a5568;
          font-size: 1.1rem;
        }
        @media (max-width: 768px) {
          .tabs {
            flex-direction: column;
          }
          .cards-grid {
            grid-template-columns: 1fr;
          }
          .card-actions {
            flex-direction: column;
          }
          .connect-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Connect; 