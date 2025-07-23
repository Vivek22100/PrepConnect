import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const ExperienceMap = () => {
  const { user } = useAuth();
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    totalDays: '',
    successRate: '',
    timeline: [
      { date: '', title: '', description: '', icon: '', category: '' }
    ]
  });

  // Mock journey data
  const mockJourneys = [
    {
      _id: '1',
      user: { name: 'Amit Sharma', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      company: 'Google',
      role: 'Senior Software Engineer',
      timeline: [
        {
          id: 1,
          date: '2023-01-15',
          title: 'Started Preparation',
          description: 'Began studying algorithms and data structures',
          icon: '📚',
          category: 'preparation'
        },
        {
          id: 2,
          date: '2023-02-20',
          title: 'First Mock Interview',
          description: 'Completed first mock interview with a senior',
          icon: '🎤',
          category: 'practice'
        },
        {
          id: 3,
          date: '2023-03-10',
          title: 'Applied to Google',
          description: 'Submitted application for Software Engineer position',
          icon: '📝',
          category: 'application'
        },
        {
          id: 4,
          date: '2023-03-25',
          title: 'Phone Screen',
          description: 'Passed initial phone screening with recruiter',
          icon: '📞',
          category: 'interview'
        },
        {
          id: 5,
          date: '2023-04-15',
          title: 'Onsite Interviews',
          description: 'Completed 5 rounds of onsite interviews',
          icon: '🏢',
          category: 'interview'
        },
        {
          id: 6,
          date: '2023-04-30',
          title: 'Offer Received',
          description: 'Received and accepted offer from Google',
          icon: '🎉',
          category: 'success'
        }
      ],
      totalDays: 105,
      successRate: 100
    },
    {
      _id: '2',
      user: { name: 'Priya Patel', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      company: 'Amazon',
      role: 'Software Development Engineer',
      timeline: [
        {
          id: 1,
          date: '2023-02-01',
          title: 'Preparation Phase',
          description: 'Started with system design and behavioral questions',
          icon: '📖',
          category: 'preparation'
        },
        {
          id: 2,
          date: '2023-03-15',
          title: 'Mock Interviews',
          description: 'Completed 3 mock interviews focusing on leadership principles',
          icon: '🤝',
          category: 'practice'
        },
        {
          id: 3,
          date: '2023-04-01',
          title: 'Application Submitted',
          description: 'Applied through Amazon careers portal',
          icon: '📋',
          category: 'application'
        },
        {
          id: 4,
          date: '2023-04-20',
          title: 'Online Assessment',
          description: 'Completed coding assessment with 2 problems',
          icon: '💻',
          category: 'interview'
        },
        {
          id: 5,
          date: '2023-05-10',
          title: 'Final Interview',
          description: 'Completed final round with hiring manager',
          icon: '🎯',
          category: 'interview'
        },
        {
          id: 6,
          date: '2023-05-25',
          title: 'Offer Accepted',
          description: 'Received offer and accepted the position',
          icon: '✅',
          category: 'success'
        }
      ],
      totalDays: 113,
      successRate: 100
    },
    {
      _id: '3',
      user: { name: 'Rahul Kumar', avatar: 'https://randomuser.me/api/portraits/men/65.jpg' },
      company: 'Microsoft',
      role: 'Software Engineer',
      timeline: [
        {
          id: 1,
          date: '2023-01-10',
          title: 'Study Plan Created',
          description: 'Created comprehensive study plan covering all topics',
          icon: '📋',
          category: 'preparation'
        },
        {
          id: 2,
          date: '2023-02-28',
          title: 'Practice Sessions',
          description: 'Started daily practice sessions with peers',
          icon: '👥',
          category: 'practice'
        },
        {
          id: 3,
          date: '2023-03-20',
          title: 'Application',
          description: 'Applied through Microsoft careers',
          icon: '📝',
          category: 'application'
        },
        {
          id: 4,
          date: '2023-04-05',
          title: 'First Round',
          description: 'Completed first technical interview',
          icon: '🔍',
          category: 'interview'
        },
        {
          id: 5,
          date: '2023-04-20',
          title: 'Final Round',
          description: 'Completed final interview round',
          icon: '🏁',
          category: 'interview'
        },
        {
          id: 6,
          date: '2023-05-05',
          title: 'Offer',
          description: 'Received offer from Microsoft',
          icon: '🎊',
          category: 'success'
        }
      ],
      totalDays: 115,
      successRate: 100
    }
  ];

  // Fetch journeys from backend
  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/experiences/journeys');
      if (response.ok) {
        const data = await response.json();
        setJourneys(data);
        setSelectedJourney(data[0] || null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimelineChange = (idx, e) => {
    const newTimeline = formData.timeline.map((step, i) =>
      i === idx ? { ...step, [e.target.name]: e.target.value } : step
    );
    setFormData({ ...formData, timeline: newTimeline });
  };

  const addTimelineStep = () => {
    setFormData({
      ...formData,
      timeline: [...formData.timeline, { date: '', title: '', description: '', icon: '', category: '' }]
    });
  };

  const removeTimelineStep = (idx) => {
    setFormData({
      ...formData,
      timeline: formData.timeline.filter((_, i) => i !== idx)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/experiences/journeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          company: formData.company,
          role: formData.role,
          totalDays: formData.totalDays,
          successRate: formData.successRate,
          timeline: formData.timeline
        })
      });
      if (response.ok) {
        setFormData({
          company: '',
          role: '',
          totalDays: '',
          successRate: '',
          timeline: [{ date: '', title: '', description: '', icon: '', category: '' }]
        });
        fetchJourneys();
        alert('Journey shared successfully!');
      } else {
        alert('Failed to share journey');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'preparation': return '#3182ce';
      case 'practice': return '#38a169';
      case 'application': return '#d69e2e';
      case 'interview': return '#e53e3e';
      case 'success': return '#805ad5';
      default: return '#718096';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="experience-map-page">
      <div className="container">
        <h1>Experience Map</h1>
        <p className="subtitle">Visualize interview preparation journeys and success paths from the community</p>

        {/* Share Journey Form */}
        {user && (
          <div className="form-section">
            <h2>Share Your Experience Map</h2>
            <form onSubmit={handleSubmit} className="journey-form">
              <div className="form-group">
                <label>Company *</label>
                <input type="text" name="company" value={formData.company} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Role/Position *</label>
                <input type="text" name="role" value={formData.role} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Total Days</label>
                <input type="number" name="totalDays" value={formData.totalDays} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label>Success Rate (%)</label>
                <input type="number" name="successRate" value={formData.successRate} onChange={handleFormChange} />
              </div>
              <div className="timeline-section">
                <h3>Timeline Steps</h3>
                {formData.timeline.map((step, idx) => (
                  <div key={idx} className="timeline-step">
                    <input type="date" name="date" value={step.date} onChange={e => handleTimelineChange(idx, e)} required />
                    <input type="text" name="title" value={step.title} onChange={e => handleTimelineChange(idx, e)} placeholder="Title" required />
                    <input type="text" name="description" value={step.description} onChange={e => handleTimelineChange(idx, e)} placeholder="Description" />
                    <input type="text" name="icon" value={step.icon} onChange={e => handleTimelineChange(idx, e)} placeholder="Icon (e.g. 🎤)" />
                    <input type="text" name="category" value={step.category} onChange={e => handleTimelineChange(idx, e)} placeholder="Category" />
                    {formData.timeline.length > 1 && (
                      <button type="button" className="remove-step" onClick={() => removeTimelineStep(idx)}>&times;</button>
                    )}
                  </div>
                ))}
                <button type="button" className="add-step" onClick={addTimelineStep}>+ Add Step</button>
              </div>
              <button type="submit" className="submit-btn" disabled={submitting}>{submitting ? 'Sharing...' : 'Share Journey'}</button>
            </form>
          </div>
        )}

        <div className="content-grid">
          {/* Journey Selection */}
          <div className="journeys-section">
            <h2>Success Journeys</h2>
            {loading ? (
              <div className="loading">Loading journeys...</div>
            ) : (
              <div className="journeys-list">
                {journeys.map((journey) => (
                  <div
                    key={journey._id}
                    className={`journey-card ${selectedJourney?._id === journey._id ? 'active' : ''}`}
                    onClick={() => setSelectedJourney(journey)}
                  >
                    <div className="journey-header">
                      <img
                        src={journey.user && journey.user.avatar ? journey.user.avatar : 'https://ui-avatars.com/api/?name=Anonymous'}
                        alt={journey.user && journey.user.name ? journey.user.name : 'Anonymous'}
                        className="journey-avatar"
                      />
                      <div className="journey-info">
                        <h3>{journey.user && journey.user.name ? journey.user.name : 'Anonymous'}</h3>
                        <p className="journey-role">{journey.role}</p>
                        <p className="journey-company">{journey.company}</p>
                      </div>
                    </div>
                    <div className="journey-stats">
                      <span className="days">📅 {journey.totalDays} days</span>
                      <span className="success">✅ {journey.successRate}% success</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timeline Visualization */}
          <div className="timeline-section">
            <h2>Journey Timeline</h2>
            {selectedJourney ? (
              <div className="timeline-container">
                <div className="journey-summary">
                  <div className="summary-header">
                    <img src={selectedJourney.user.avatar} alt={selectedJourney.user.name} className="summary-avatar" />
                    <div>
                      <h3>{selectedJourney.user.name}'s Journey to {selectedJourney.company}</h3>
                      <p>{selectedJourney.role} • {selectedJourney.totalDays} days • {selectedJourney.successRate}% success rate</p>
                    </div>
                  </div>
                </div>

                <div className="timeline">
                  {selectedJourney.timeline.map((step, index) => (
                    <div key={step.id} className="timeline-item">
                      <div className="timeline-marker" style={{ backgroundColor: getCategoryColor(step.category) }}>
                        <span className="step-icon">{step.icon}</span>
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h4>{step.title}</h4>
                          <span className="timeline-date">{formatDate(step.date)}</span>
                        </div>
                        <p className="timeline-description">{step.description}</p>
                        {index < selectedJourney.timeline.length - 1 && (
                          <div className="timeline-connector" style={{ backgroundColor: getCategoryColor(step.category) }}></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="journey-insights">
                  <h3>Key Insights</h3>
                  <div className="insights-grid">
                    <div className="insight-card">
                      <h4>Preparation Time</h4>
                      <p>{calculateDaysBetween(selectedJourney.timeline[0].date, selectedJourney.timeline[2].date)} days</p>
                    </div>
                    <div className="insight-card">
                      <h4>Interview Process</h4>
                      <p>{calculateDaysBetween(selectedJourney.timeline[3].date, selectedJourney.timeline[5].date)} days</p>
                    </div>
                    <div className="insight-card">
                      <h4>Total Journey</h4>
                      <p>{selectedJourney.totalDays} days</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-journey-selected">
                <h3>Select a journey to view timeline</h3>
                <p>Choose from the success stories on the left to see their detailed preparation journey</p>
              </div>
            )}
          </div>
        </div>

        {/* Community Stats */}
        <div className="stats-section">
          <h2>Community Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>150+</h3>
                <p>Success Stories</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>85%</h3>
                <p>Success Rate</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <h3>90 days</h3>
                <p>Average Prep Time</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-content">
                <h3>25+</h3>
                <p>Companies</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .experience-map-page {
          min-height: 80vh;
          background: #f7fafc;
          padding: 2rem 1rem;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .experience-map-page h1 {
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
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .journeys-section,
        .timeline-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .journeys-section h2,
        .timeline-section h2 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .loading {
          text-align: center;
          color: #718096;
          padding: 2rem;
        }
        .journeys-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .journey-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .journey-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .journey-card.active {
          border-color: #3182ce;
          background: #e6f0fa;
        }
        .journey-header {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .journey-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 0.75rem;
        }
        .journey-info h3 {
          color: #2d3748;
          margin-bottom: 0.25rem;
          font-size: 1rem;
        }
        .journey-role {
          color: #4a5568;
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
        }
        .journey-company {
          color: #718096;
          font-size: 0.8rem;
        }
        .journey-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #718096;
        }
        .journey-summary {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .summary-header {
          display: flex;
          align-items: center;
        }
        .summary-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin-right: 1rem;
        }
        .summary-header h3 {
          color: #2d3748;
          margin-bottom: 0.25rem;
        }
        .summary-header p {
          color: #718096;
          font-size: 0.9rem;
        }
        .timeline {
          position: relative;
          padding-left: 2rem;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 2rem;
        }
        .timeline-marker {
          position: absolute;
          left: -2.5rem;
          top: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
        }
        .timeline-content {
          background: #f7fafc;
          border-radius: 8px;
          padding: 1rem;
          margin-left: 1rem;
        }
        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .timeline-header h4 {
          color: #2d3748;
          margin: 0;
          font-size: 1rem;
        }
        .timeline-date {
          color: #718096;
          font-size: 0.8rem;
        }
        .timeline-description {
          color: #4a5568;
          font-size: 0.9rem;
          line-height: 1.4;
          margin: 0;
        }
        .timeline-connector {
          position: absolute;
          left: -0.8rem;
          top: 40px;
          width: 2px;
          height: 2rem;
        }
        .journey-insights {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }
        .journey-insights h3 {
          color: #2d3748;
          margin-bottom: 1rem;
        }
        .insights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        .insight-card {
          background: #f7fafc;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
        }
        .insight-card h4 {
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }
        .insight-card p {
          color: #3182ce;
          font-weight: 600;
          font-size: 1.1rem;
          margin: 0;
        }
        .no-journey-selected {
          text-align: center;
          color: #718096;
          padding: 3rem 1rem;
        }
        .no-journey-selected h3 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        .stats-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .stats-section h2 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          text-align: center;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        .stat-card {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          background: #f7fafc;
          border-radius: 8px;
          text-align: center;
        }
        .stat-icon {
          font-size: 2rem;
          margin-right: 1rem;
        }
        .stat-content h3 {
          color: #3182ce;
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }
        .stat-content p {
          color: #4a5568;
          font-size: 0.9rem;
          margin: 0;
        }
        .form-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin-bottom: 3rem;
        }
        .form-section h2 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .journey-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          color: #4a5568;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .form-group input,
        .form-group select {
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
          color: #2d3748;
        }
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
        }
        .timeline-section h3 {
          color: #2d3748;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }
        .timeline-step {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
          padding: 0.75rem 1rem;
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }
        .timeline-step input {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        .timeline-step input:focus {
          border-color: #3182ce;
          box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
        }
        .add-step,
        .remove-step {
          background: #3182ce;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s;
        }
        .add-step:hover {
          background: #2b6cb0;
        }
        .remove-step {
          background: #e53e3e;
        }
        .remove-step:hover {
          background: #c53030;
        }
        .submit-btn {
          background: #3182ce;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        .submit-btn:hover {
          background: #2b6cb0;
        }
        .submit-btn:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          .insights-grid {
            grid-template-columns: 1fr;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .experience-map-page h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ExperienceMap; 