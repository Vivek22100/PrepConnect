import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ExperienceCard from '../components/ExperienceCard.jsx';

const Explore = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [selectedTag, setSelectedTag] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [upvoting, setUpvoting] = useState({});

  // Fetch experiences from backend
  useEffect(() => {
    fetchExperiences();
  }, [sortBy, selectedTag]);

  // Fetch available tags
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/experiences/tags');
      if (response.ok) {
        const tags = await response.json();
        setAvailableTags(tags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (sortBy) params.append('sort', sortBy);
      if (selectedTag) params.append('tag', selectedTag);
      
      const response = await fetch(`/api/experiences?${params}`);
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

  const handleUpvote = async (experienceId) => {
    if (!user) {
      alert('Please login to upvote experiences');
      return;
    }

    setUpvoting(prev => ({ ...prev, [experienceId]: true }));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/experiences/${experienceId}/upvote`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh experiences to get updated upvote count
        fetchExperiences();
      } else {
        alert('Failed to upvote experience');
      }
    } catch (error) {
      console.error('Error upvoting:', error);
      alert('Error upvoting experience');
    } finally {
      setUpvoting(prev => ({ ...prev, [experienceId]: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isUpvoted = (experience) => {
    return user && experience.upvotes && experience.upvotes.some(id => id === user.id);
  };

  return (
    <div className="explore-page">
      <div className="container">
        <div className="explore-header">
          <h1>Explore Interview Experiences</h1>
          <p className="subtitle">Discover real interview stories from the community</p>
        </div>

        {/* Filters and Sorting */}
        <div className="filters-section">
          <div className="sort-controls">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="tag-filters">
            <label>Filter by tag:</label>
            <select 
              value={selectedTag} 
              onChange={(e) => setSelectedTag(e.target.value)}
              className="tag-select"
            >
              <option value="">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Experiences Grid */}
        <div className="experiences-section">
          {loading ? (
            <div className="loading">Loading experiences...</div>
          ) : experiences.length === 0 ? (
            <div className="no-experiences">
              <h3>No experiences found</h3>
              <p>Try adjusting your filters or be the first to share an experience!</p>
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>Found {experiences.length} experience{experiences.length !== 1 ? 's' : ''}</p>
                {selectedTag && (
                  <span className="active-filter">
                    Filtered by: <strong>{selectedTag}</strong>
                    <button 
                      onClick={() => setSelectedTag('')}
                      className="clear-filter"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
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
            </>
          )}
        </div>
      </div>

      <style>{`
        .explore-page {
          min-height: 80vh;
          background: #f7fafc;
          padding: 2rem 1rem;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .explore-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .explore-header h1 {
          color: #3182ce;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .subtitle {
          color: #4a5568;
          font-size: 1.1rem;
        }
        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .sort-controls, .tag-filters {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sort-controls label, .tag-filters label {
          font-weight: 600;
          color: #2d3748;
          white-space: nowrap;
        }
        .sort-select, .tag-select {
          padding: 0.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.9rem;
          background: white;
          cursor: pointer;
        }
        .sort-select:focus, .tag-select:focus {
          outline: none;
          border-color: #3182ce;
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
          transform: translateY(-2px);
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
          background: #e2e8f0;
          color: #2d3748;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .tag:hover {
          background: #cbd5e0;
        }
        .experience-stats {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .upvote-btn {
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          color: #4a5568;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        .upvote-btn:hover:not(:disabled) {
          background: #edf2f7;
          border-color: #cbd5e0;
        }
        .upvote-btn.upvoted {
          background: #3182ce;
          color: white;
          border-color: #3182ce;
        }
        .upvote-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .comments {
          color: #718096;
          font-size: 0.9rem;
        }
        .loading, .no-experiences {
          text-align: center;
          padding: 3rem;
          color: #4a5568;
        }
        .no-experiences h3 {
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        .results-info {
          background: #edf2f7;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .results-info p {
          margin: 0;
          color: #4a5568;
          font-size: 0.9rem;
        }
        .active-filter {
          background: #e2e8f0;
          border-radius: 6px;
          padding: 0.4rem 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #2d3748;
        }
        .active-filter strong {
          color: #3182ce;
          font-weight: 600;
        }
        .clear-filter {
          background: none;
          border: none;
          color: #718096;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        .clear-filter:hover {
          color: #e53e3e;
        }
        @media (max-width: 768px) {
          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }
          .sort-controls, .tag-filters {
            justify-content: space-between;
          }
          .experiences-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Explore; 