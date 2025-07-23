import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExperienceCard = ({ 
  id,
  title, 
  content, 
  user, 
  tags = [],
  upvotes = [],
  downvotes = [],
  company = 'Unknown Company'
}) => {
  const navigate = useNavigate();
  const [upvoteCount, setUpvoteCount] = useState(upvotes.length);
  const [downvoteCount, setDownvoteCount] = useState(downvotes.length);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);

  const handleCardClick = () => {
    navigate(`/experience/${id}`);
  };

  const handleUpvote = (e) => {
    e.stopPropagation();
    if (hasUpvoted) {
      setUpvoteCount(prev => prev - 1);
      setHasUpvoted(false);
    } else {
      setUpvoteCount(prev => prev + 1);
      setHasUpvoted(true);
      if (hasDownvoted) {
        setDownvoteCount(prev => prev - 1);
        setHasDownvoted(false);
      }
    }
  };

  const handleDownvote = (e) => {
    e.stopPropagation();
    if (hasDownvoted) {
      setDownvoteCount(prev => prev - 1);
      setHasDownvoted(false);
    } else {
      setDownvoteCount(prev => prev + 1);
      setHasDownvoted(true);
      if (hasUpvoted) {
        setUpvoteCount(prev => prev - 1);
        setHasUpvoted(false);
      }
    }
  };

  return (
    <div className="experience-card" onClick={handleCardClick}>
      <div className="card-header">
        <h3 className="title">{title}</h3>
        <div className="company">{company}</div>
      </div>
      
      <div className="card-content">
        <p className="content">
          {content.length > 150 ? `${content.substring(0, 150)}...` : content}
        </p>
      </div>
      
      <div className="card-footer">
        <div className="author">
          <span className="author-name">{user}</span>
        </div>
        
        <div className="tags">
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="tag more">+{tags.length - 3}</span>
          )}
        </div>
        
        <div className="voting">
          <button 
            className={`vote-btn upvote ${hasUpvoted ? 'active' : ''}`}
            onClick={handleUpvote}
            aria-label="Upvote"
          >
            <span className="vote-icon">▲</span>
            <span className="vote-count">{upvoteCount}</span>
          </button>
          
          <button 
            className={`vote-btn downvote ${hasDownvoted ? 'active' : ''}`}
            onClick={handleDownvote}
            aria-label="Downvote"
          >
            <span className="vote-icon">▼</span>
            <span className="vote-count">{downvoteCount}</span>
          </button>
        </div>
      </div>

      <style>{`
        .experience-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid #e2e8f0;
        }
        .experience-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .card-header {
          margin-bottom: 1rem;
        }
        .title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }
        .company {
          color: #718096;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .card-content {
          margin-bottom: 1rem;
        }
        .content {
          color: #4a5568;
          line-height: 1.6;
          margin: 0;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .author {
          display: flex;
          align-items: center;
        }
        .author-name {
          color: #3182ce;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .tag {
          background: #e2e8f0;
          color: #4a5568;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .tag.more {
          background: #cbd5e0;
          color: #2d3748;
        }
        .voting {
          display: flex;
          gap: 0.5rem;
        }
        .vote-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }
        .vote-btn:hover {
          background: #f7fafc;
        }
        .vote-btn.active {
          background: #3182ce;
          color: white;
          border-color: #3182ce;
        }
        .vote-btn.upvote.active {
          background: #48bb78;
          border-color: #48bb78;
        }
        .vote-btn.downvote.active {
          background: #f56565;
          border-color: #f56565;
        }
        .vote-icon {
          font-size: 0.75rem;
        }
        .vote-count {
          font-weight: 600;
        }
        @media (max-width: 768px) {
          .card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .voting {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default ExperienceCard; 