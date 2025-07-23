import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ExperienceCard from '../components/ExperienceCard.jsx';

const ExperienceSharing = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    company: '',
    position: '',
    batch: '',
    level: '',
    interviewProcess: '',
    keyLearnings: '',
    advice: ''
  });

  // Fetch experiences from backend
  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experiences');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      } else {
        console.error('Failed to fetch experiences:', response.status);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to share an experience');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('No authentication token found. Please login again.');
        return;
      }

      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          company: formData.company,
          position: formData.position,
          batch: formData.batch,
          level: formData.level,
          interviewProcess: formData.interviewProcess,
          keyLearnings: formData.keyLearnings,
          advice: formData.advice
        })
      });

      if (response.ok) {
        const newExperience = await response.json();
        setExperiences([newExperience, ...experiences]);
        setFormData({ title: '', content: '', tags: '', company: '', position: '', batch: '', level: '', interviewProcess: '', keyLearnings: '', advice: '' });
        alert('Experience shared successfully!');
      } else if (response.status === 401) {
        // Handle unauthorized error
        const errorData = await response.json();
        console.error('Authentication error:', errorData);
        alert('Authentication failed. Please login again.');
        // Optionally redirect to login or clear token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert(`Failed to share experience: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting experience:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="experience-sharing-page">
      <div className="container">
        <h1>Share Your Interview Experience</h1>
        <p className="subtitle">Help others by sharing your real interview stories and learn from the community</p>

        {/* Submit Experience Form */}
        <div className="form-section">
          <h2>Share Your Experience</h2>
          <form onSubmit={handleSubmit} className="experience-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., My Google Software Engineer Interview Experience"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g., Google"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Position/Role *</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="e.g., Software Engineer Intern"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="batch">Batch</label>
              <input
                type="text"
                id="batch"
                name="batch"
                value={formData.batch}
                onChange={handleInputChange}
                placeholder="e.g., Summer 2023"
              />
            </div>
            <div className="form-group">
              <label htmlFor="level">Experience Level</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
              >
                <option value="">Select Level</option>
                <option value="Intern">Intern</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="content">Description *</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Share your detailed interview experience, questions asked, preparation tips, and outcomes..."
                rows="6"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="interviewProcess">Interview Process</label>
              <textarea
                id="interviewProcess"
                name="interviewProcess"
                value={formData.interviewProcess}
                onChange={handleInputChange}
                placeholder="Describe the interview process, rounds, and questions asked."
                rows="4"
              />
            </div>
            <div className="form-group">
              <label htmlFor="keyLearnings">Key Learnings</label>
              <textarea
                id="keyLearnings"
                name="keyLearnings"
                value={formData.keyLearnings}
                onChange={handleInputChange}
                placeholder="What did you learn from this experience?"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label htmlFor="advice">Advice for Others</label>
              <textarea
                id="advice"
                name="advice"
                value={formData.advice}
                onChange={handleInputChange}
                placeholder="Share your advice for future candidates."
                rows="3"
              />
            </div>
            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., Google, Software Engineer, Algorithms, System Design"
              />
            </div>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Sharing...' : 'Share Experience'}
            </button>
          </form>
        </div>

        {/* Experiences List */}
        <div className="experiences-section">
          <h2>Recent Experiences</h2>
          {loading ? (
            <div className="loading">Loading experiences...</div>
          ) : experiences.length === 0 ? (
            <div className="no-experiences">No experiences shared yet. Be the first to share!</div>
          ) : (
            <div className="experiences-grid">
              {experiences.map((experience) => (
                <ExperienceCard
                  key={experience._id}
                  id={experience._id}
                  title={experience.title}
                  content={experience.content}
                  user={experience.user?.name || 'Anonymous'}
                  tags={experience.tags}
                  upvotes={experience.upvotes}
                  downvotes={experience.downvotes}
                  company={experience.company}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .experience-sharing-page {
          min-height: 80vh;
          background: #f7fafc;
          padding: 2rem 1rem;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .experience-sharing-page h1 {
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
        .form-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 3rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .form-section h2 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .experience-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-weight: 600;
          color: #2d3748;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group textarea:focus,
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
        .experiences-section h2 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .loading,
        .no-experiences {
          text-align: center;
          color: #4a5568;
          font-size: 1.1rem;
          padding: 2rem;
        }
        .experiences-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        .experience-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .experience-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .experience-header h3 {
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }
        .experience-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.9rem;
          color: #718096;
          margin-bottom: 1rem;
        }
        .experience-content {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .tag {
          background: #e6f0fa;
          color: #3182ce;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .experience-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.9rem;
          color: #718096;
        }
        @media (max-width: 768px) {
          .experiences-grid {
            grid-template-columns: 1fr;
          }
          .experience-sharing-page h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ExperienceSharing; 