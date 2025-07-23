import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const UserProfiles = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [connecting, setConnecting] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (users.length > 0 && user) {
      fetchConnectionStatuses();
    }
  }, [users, user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter out current user
        const filteredUsers = data.filter(u => u._id !== user?.id && u._id !== user?._id);
        setUsers(filteredUsers);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectionStatuses = async () => {
    try {
      const token = localStorage.getItem('token');
      const statuses = {};
      
      // Fetch connection status for each user
      await Promise.all(
        users.map(async (userProfile) => {
          try {
            const response = await fetch(`/api/connections/status/${userProfile._id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              statuses[userProfile._id] = data;
            }
          } catch (error) {
            console.error(`Error fetching status for user ${userProfile._id}:`, error);
            statuses[userProfile._id] = { status: 'none', isInitiator: false };
          }
        })
      );
      
      setConnectionStatuses(statuses);
    } catch (error) {
      console.error('Error fetching connection statuses:', error);
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
        // Update connection status
        setConnectionStatuses(prev => ({
          ...prev,
          [userId]: { status: 'pending', isInitiator: true }
        }));
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

  const handleAccept = async (userId) => {
    setConnecting(prev => ({ ...prev, [userId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      const connectionId = connectionStatuses[userId]?.connection?._id;
      
      if (!connectionId) {
        alert('Connection request not found');
        return;
      }

      const response = await fetch(`/api/connections/respond/${connectionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'accepted' })
      });

      if (response.ok) {
        alert('Connection accepted!');
        setConnectionStatuses(prev => ({
          ...prev,
          [userId]: { status: 'accepted', isInitiator: false }
        }));
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to accept connection');
      }
    } catch (error) {
      console.error('Error accepting connection:', error);
      alert('Error accepting connection');
    } finally {
      setConnecting(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleDeny = async (userId) => {
    setConnecting(prev => ({ ...prev, [userId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      const connectionId = connectionStatuses[userId]?.connection?._id;
      
      if (!connectionId) {
        alert('Connection request not found');
        return;
      }

      const response = await fetch(`/api/connections/respond/${connectionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'rejected' })
      });

      if (response.ok) {
        alert('Connection request denied');
        setConnectionStatuses(prev => ({
          ...prev,
          [userId]: { status: 'rejected', isInitiator: false }
        }));
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to deny connection');
      }
    } catch (error) {
      console.error('Error denying connection:', error);
      alert('Error denying connection');
    } finally {
      setConnecting(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getConnectionButtonText = (userId) => {
    const status = connectionStatuses[userId]?.status || 'none';
    const isInitiator = connectionStatuses[userId]?.isInitiator || false;
    
    switch (status) {
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

  const getConnectionButtonClass = (userId) => {
    const status = connectionStatuses[userId]?.status || 'none';
    const isInitiator = connectionStatuses[userId]?.isInitiator || false;
    
    switch (status) {
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

  const isConnectionDisabled = (userId) => {
    const status = connectionStatuses[userId]?.status || 'none';
    return connecting[userId] || status === 'pending' || status === 'accepted';
  };

  const renderConnectionButton = (userProfile) => {
    const status = connectionStatuses[userProfile._id]?.status || 'none';
    const isInitiator = connectionStatuses[userProfile._id]?.isInitiator || false;

    if (status === 'pending' && !isInitiator) {
      return (
        <div className="connection-actions">
          <button 
            className="btn btn-accept"
            onClick={() => handleAccept(userProfile._id)}
            disabled={connecting[userProfile._id]}
          >
            {connecting[userProfile._id] ? 'Accepting...' : 'Accept'}
          </button>
          <button 
            className="btn btn-deny"
            onClick={() => handleDeny(userProfile._id)}
            disabled={connecting[userProfile._id]}
          >
            {connecting[userProfile._id] ? 'Denying...' : 'Deny'}
          </button>
        </div>
      );
    }

    return (
      <button 
        className={`btn ${getConnectionButtonClass(userProfile._id)}`}
        onClick={() => handleConnect(userProfile._id)}
        disabled={isConnectionDisabled(userProfile._id)}
      >
        {connecting[userProfile._id] ? 'Connecting...' : getConnectionButtonText(userProfile._id)}
      </button>
    );
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(userProfile => {
    const matchesSearch = userProfile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userProfile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (userProfile.role && userProfile.role.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'all' || userProfile.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (!user) {
    return (
      <div className="user-profiles-page">
        <div className="no-auth">
          <h3>Please login to view user profiles</h3>
          <p>You need to be logged in to connect with other users</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profiles-page">
      <div className="container">
        <div className="page-header">
          <h1>User Profiles</h1>
          <p>Connect with other professionals and build your network</p>
          <div className="header-actions">
            <a href="/connect" className="btn btn-secondary">
              Manage Connections
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="role-filter">
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="role-select"
            >
              <option value="all">All Roles</option>
              <option value="junior">Junior Developer</option>
              <option value="senior">Senior Developer</option>
              <option value="lead">Tech Lead</option>
              <option value="manager">Engineering Manager</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="results-info">
          <p>Showing {filteredUsers.length} of {users.length} users</p>
        </div>

        {loading ? (
          <div className="loading">Loading user profiles...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="no-results">
            <p>No users found matching your criteria</p>
            {searchTerm && <p>Try adjusting your search terms</p>}
          </div>
        ) : (
          <div className="profiles-grid">
            {filteredUsers.map((userProfile) => (
              <div key={userProfile._id} className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <h3>{userProfile.name}</h3>
                    <p className="role">{userProfile.role || 'Developer'}</p>
                    <p className="email">{userProfile.email}</p>
                  </div>
                </div>
                
                <div className="profile-actions">
                  {renderConnectionButton(userProfile)}
                </div>

                <div className="connection-status">
                  {(() => {
                    const status = connectionStatuses[userProfile._id]?.status || 'none';
                    const isInitiator = connectionStatuses[userProfile._id]?.isInitiator || false;
                    
                    switch (status) {
                      case 'none':
                        return <span className="status-none">No connection</span>;
                      case 'pending':
                        return (
                          <span className="status-pending">
                            {isInitiator ? 'Request sent' : 'Request received'}
                          </span>
                        );
                      case 'accepted':
                        return <span className="status-connected">Connected</span>;
                      case 'rejected':
                        return <span className="status-rejected">Request rejected</span>;
                      default:
                        return null;
                    }
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .user-profiles-page {
          min-height: 80vh;
          background: #f7fafc;
          padding: 2rem 1rem;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .page-header h1 {
          color: #2d3748;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .page-header p {
          color: #718096;
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
        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .search-box {
          flex: 1;
        }
        .search-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
        }
        .search-input:focus {
          border-color: #3182ce;
        }
        .role-filter {
          min-width: 200px;
        }
        .role-select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          background: white;
        }
        .role-select:focus {
          border-color: #3182ce;
        }
        .results-info {
          margin-bottom: 2rem;
          color: #718096;
          font-size: 0.9rem;
        }
        .profiles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        .profile-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .profile-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .profile-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #3182ce;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.5rem;
        }
        .profile-info h3 {
          margin: 0 0 0.25rem 0;
          color: #2d3748;
          font-size: 1.2rem;
        }
        .role {
          color: #4a5568;
          font-weight: 500;
          margin: 0.25rem 0;
          text-transform: capitalize;
        }
        .email {
          color: #718096;
          font-size: 0.9rem;
          margin: 0.25rem 0;
        }
        .profile-actions {
          margin-bottom: 1rem;
        }
        .connection-actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          font-size: 0.9rem;
          width: 100%;
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
        .btn-accept {
          background: #48bb78;
          color: white;
          flex: 1;
        }
        .btn-accept:hover:not(:disabled) {
          background: #38a169;
        }
        .btn-deny {
          background: #f56565;
          color: white;
          flex: 1;
        }
        .btn-deny:hover:not(:disabled) {
          background: #e53e3e;
        }
        .connection-status {
          text-align: center;
        }
        .connection-status span {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .status-none {
          background: #f7fafc;
          color: #718096;
        }
        .status-pending {
          background: #fef3c7;
          color: #d69e2e;
        }
        .status-connected {
          background: #c6f6d5;
          color: #38a169;
        }
        .status-rejected {
          background: #fed7d7;
          color: #e53e3e;
        }
        .loading, .no-results, .no-auth {
          text-align: center;
          padding: 3rem;
          color: #718096;
          font-size: 1.1rem;
        }
        .no-results p {
          margin: 0.5rem 0;
        }
        @media (max-width: 768px) {
          .filters {
            flex-direction: column;
          }
          .profiles-grid {
            grid-template-columns: 1fr;
          }
          .connection-actions {
            flex-direction: column;
          }
          .page-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfiles; 