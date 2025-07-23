import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const MockInterview = () => {
  const { user } = useAuth();
  const [seniors, setSeniors] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSenior, setSelectedSenior] = useState('');
  const [topic, setTopic] = useState('');
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Mock seniors data
  const mockSeniors = [
    { _id: '1', name: 'Amit Sharma', company: 'Google', role: 'Senior Software Engineer', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 4.8, interviews: 45 },
    { _id: '2', name: 'Priya Patel', company: 'Microsoft', role: 'Senior Developer', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 4.9, interviews: 32 },
    { _id: '3', name: 'Rahul Kumar', company: 'Amazon', role: 'Tech Lead', avatar: 'https://randomuser.me/api/portraits/men/65.jpg', rating: 4.7, interviews: 28 },
    { _id: '4', name: 'Neha Singh', company: 'Meta', role: 'Senior Engineer', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', rating: 4.6, interviews: 38 }
  ];

  // Mock scheduled interviews
  const mockScheduledInterviews = [
    {
      _id: '1',
      seniorRef: { _id: '1', name: 'Amit Sharma', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
      topic: 'System Design',
      status: 'pending'
    },
    {
      _id: '2',
      seniorRef: { _id: '2', name: 'Priya Patel', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      scheduledAt: new Date(Date.now() + 172800000), // Day after tomorrow
      topic: 'Algorithms',
      status: 'pending'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSeniors(mockSeniors);
      setScheduledInterviews(mockScheduledInterviews);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to schedule an interview');
      return;
    }

    if (!selectedSenior || !selectedDate || !selectedTime || !topic) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}`);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/mock-interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          seniorRef: selectedSenior,
          scheduledAt: scheduledAt.toISOString(),
          topic
        })
      });

      if (response.ok) {
        const newInterview = await response.json();
        setScheduledInterviews([...scheduledInterviews, newInterview]);
        setSelectedSenior('');
        setSelectedDate('');
        setSelectedTime('');
        setTopic('');
        alert('Mock interview scheduled successfully!');
      } else {
        alert('Failed to schedule interview');
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      alert('Error scheduling interview');
    } finally {
      setSubmitting(false);
    }
  };

  const getAvailableTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f6ad55';
      case 'completed': return '#48bb78';
      case 'cancelled': return '#f56565';
      default: return '#a0aec0';
    }
  };

  return (
    <div className="mock-interview-page">
      <div className="container">
        <h1>Schedule Mock Interview</h1>
        <p className="subtitle">Book a mock interview with experienced seniors to practice and get feedback</p>

        <div className="content-grid">
          {/* Schedule Form */}
          <div className="schedule-section">
            <h2>Book New Interview</h2>
            <form onSubmit={handleSubmit} className="schedule-form">
              <div className="form-group">
                <label htmlFor="senior">Select Senior *</label>
                <select
                  id="senior"
                  value={selectedSenior}
                  onChange={(e) => setSelectedSenior(e.target.value)}
                  required
                >
                  <option value="">Choose a senior...</option>
                  {seniors.map((senior) => (
                    <option key={senior._id} value={senior._id}>
                      {senior.name} - {senior.role} at {senior.company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time *</label>
                  <select
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  >
                    <option value="">Select time...</option>
                    {getAvailableTimeSlots().map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="topic">Interview Topic *</label>
                <select
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                >
                  <option value="">Select topic...</option>
                  <option value="Algorithms">Algorithms & Data Structures</option>
                  <option value="System Design">System Design</option>
                  <option value="Behavioral">Behavioral Questions</option>
                  <option value="Frontend">Frontend Development</option>
                  <option value="Backend">Backend Development</option>
                  <option value="Full Stack">Full Stack Development</option>
                  <option value="Machine Learning">Machine Learning</option>
                </select>
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Scheduling...' : 'Schedule Interview'}
              </button>
            </form>
          </div>

          {/* Available Seniors */}
          <div className="seniors-section">
            <h2>Available Seniors</h2>
            {loading ? (
              <div className="loading">Loading seniors...</div>
            ) : (
              <div className="seniors-grid">
                {seniors.map((senior) => (
                  <div key={senior._id} className="senior-card">
                    <div className="senior-avatar">
                      <img src={senior.avatar} alt={senior.name} />
                    </div>
                    <div className="senior-info">
                      <h3>{senior.name}</h3>
                      <p className="senior-role">{senior.role}</p>
                      <p className="senior-company">{senior.company}</p>
                      <div className="senior-stats">
                        <span className="rating">⭐ {senior.rating}</span>
                        <span className="interviews">📊 {senior.interviews} interviews</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scheduled Interviews */}
        <div className="scheduled-section">
          <h2>Your Scheduled Interviews</h2>
          {scheduledInterviews.length === 0 ? (
            <div className="no-interviews">No interviews scheduled yet. Book your first mock interview above!</div>
          ) : (
            <div className="interviews-grid">
              {scheduledInterviews.map((interview) => (
                <div key={interview._id} className="interview-card">
                  <div className="interview-header">
                    <img src={interview.seniorRef.avatar} alt={interview.seniorRef.name} className="interview-avatar" />
                    <div className="interview-info">
                      <h3>{interview.seniorRef.name}</h3>
                      <p className="interview-topic">{interview.topic}</p>
                    </div>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(interview.status) }}
                    >
                      {interview.status}
                    </div>
                  </div>
                  <div className="interview-details">
                    <p className="interview-time">📅 {formatDate(interview.scheduledAt)}</p>
                  </div>
                  {interview.status === 'pending' && (
                    <div className="interview-actions">
                      <button className="btn-secondary">Reschedule</button>
                      <button className="btn-danger">Cancel</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .mock-interview-page {
          min-height: 80vh;
          background: #f7fafc;
          padding: 2rem 1rem;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .mock-interview-page h1 {
          text-align: center;
          color: #3182ce;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .subtitle {
          text-align: center;
          color: #4a5568;
          font-size: 1.1rem;
          margin-bottom: 3rem;
        }
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .schedule-section,
        .seniors-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .schedule-section h2,
        .seniors-section h2 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .schedule-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-group label {
          font-weight: 600;
          color: #2d3748;
        }
        .form-group input,
        .form-group select {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3182ce;
        }
        .submit-btn {
          background: #3182ce;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          background: #225ea8;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .loading {
          text-align: center;
          color: #718096;
          padding: 2rem;
        }
        .seniors-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .senior-card {
          display: flex;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .senior-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .senior-avatar {
          margin-right: 1rem;
        }
        .senior-avatar img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }
        .senior-info {
          flex: 1;
        }
        .senior-info h3 {
          color: #2d3748;
          margin-bottom: 0.25rem;
          font-size: 1.1rem;
        }
        .senior-role {
          color: #4a5568;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        .senior-company {
          color: #718096;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }
        .senior-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
        }
        .rating {
          color: #d69e2e;
        }
        .interviews {
          color: #718096;
        }
        .scheduled-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .scheduled-section h2 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .no-interviews {
          text-align: center;
          color: #718096;
          padding: 2rem;
        }
        .interviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        .interview-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .interview-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .interview-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        .interview-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 1rem;
        }
        .interview-info {
          flex: 1;
        }
        .interview-info h3 {
          color: #2d3748;
          margin-bottom: 0.25rem;
        }
        .interview-topic {
          color: #4a5568;
          font-size: 0.9rem;
        }
        .status-badge {
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .interview-details {
          margin-bottom: 1rem;
        }
        .interview-time {
          color: #718096;
          font-size: 0.9rem;
        }
        .interview-actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn-secondary,
        .btn-danger {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-secondary {
          background: #e2e8f0;
          color: #4a5568;
        }
        .btn-secondary:hover {
          background: #cbd5e0;
        }
        .btn-danger {
          background: #fed7d7;
          color: #c53030;
        }
        .btn-danger:hover {
          background: #feb2b2;
        }
        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .interviews-grid {
            grid-template-columns: 1fr;
          }
          .mock-interview-page h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MockInterview; 