import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const InterviewBank = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    company: '',
    tag: ''
  });
  const [formData, setFormData] = useState({
    question: '',
    company: '',
    tags: ''
  });

  // Mock questions data
  const mockQuestions = [
    {
      _id: '1',
      question: 'Implement a function to find the longest palindromic substring in a given string.',
      company: 'Google',
      tags: ['Algorithms', 'Dynamic Programming', 'Strings'],
      user: { name: 'Amit Sharma' },
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      _id: '2',
      question: 'Design a URL shortening service like bit.ly. Discuss the system architecture, database design, and scaling considerations.',
      company: 'Amazon',
      tags: ['System Design', 'Database', 'Scalability'],
      user: { name: 'Priya Patel' },
      createdAt: new Date(Date.now() - 172800000)
    },
    {
      _id: '3',
      question: 'Explain the difference between REST and GraphQL. When would you choose one over the other?',
      company: 'Microsoft',
      tags: ['API Design', 'Web Development', 'Backend'],
      user: { name: 'Rahul Kumar' },
      createdAt: new Date(Date.now() - 259200000)
    },
    {
      _id: '4',
      question: 'How would you implement a rate limiter for an API? Discuss different approaches and their trade-offs.',
      company: 'Meta',
      tags: ['System Design', 'API', 'Performance'],
      user: { name: 'Neha Singh' },
      createdAt: new Date(Date.now() - 345600000)
    },
    {
      _id: '5',
      question: 'Write a function to serialize and deserialize a binary tree.',
      company: 'Google',
      tags: ['Algorithms', 'Data Structures', 'Trees'],
      user: { name: 'Vikram Malhotra' },
      createdAt: new Date(Date.now() - 432000000)
    },
    {
      _id: '6',
      question: 'Explain the concept of virtual DOM in React and how it improves performance.',
      company: 'Meta',
      tags: ['Frontend', 'React', 'Performance'],
      user: { name: 'Amit Sharma' },
      createdAt: new Date(Date.now() - 518400000)
    }
  ];

  const companies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Uber', 'Airbnb'];
  const allTags = ['Algorithms', 'System Design', 'Frontend', 'Backend', 'Database', 'API Design', 'Performance', 'Scalability', 'React', 'Node.js', 'Python', 'Java', 'JavaScript'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setQuestions(mockQuestions);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to add a question');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: formData.question,
          company: formData.company,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      if (response.ok) {
        const newQuestion = await response.json();
        setQuestions([newQuestion, ...questions]);
        setFormData({ question: '', company: '', tags: '' });
        setShowAddForm(false);
        alert('Question added successfully!');
      } else {
        alert('Failed to add question');
      }
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Error adding question');
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

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const filteredQuestions = questions.filter(q => {
    const matchesCompany = !filters.company || q.company === filters.company;
    const matchesTag = !filters.tag || q.tags.includes(filters.tag);
    return matchesCompany && matchesTag;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="interview-bank-page">
      <div className="container">
        <h1>Interview Question Bank</h1>
        <p className="subtitle">Access a crowd-sourced repository of real interview questions from top companies</p>

        {/* Add Question Section */}
        <div className="add-question-section">
          <div className="section-header">
            <h2>Contribute Questions</h2>
            <button 
              className="toggle-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : 'Add Question'}
            </button>
          </div>
          
          {showAddForm && (
            <form onSubmit={handleSubmit} className="add-question-form">
              <div className="form-group">
                <label htmlFor="question">Question *</label>
                <textarea
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="Enter the interview question..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <select
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  >
                    <option value="">Select company...</option>
                    {companies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="tags">Tags (comma-separated)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., Algorithms, System Design, React"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Question'}
              </button>
            </form>
          )}
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <h2>Filter Questions</h2>
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="filter-company">Company</label>
              <select
                id="filter-company"
                name="company"
                value={filters.company}
                onChange={handleFilterChange}
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="filter-tag">Topic</label>
              <select
                id="filter-tag"
                name="tag"
                value={filters.tag}
                onChange={handleFilterChange}
              >
                <option value="">All Topics</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-stats">
              <span>{filteredQuestions.length} questions found</span>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="questions-section">
          <h2>Questions</h2>
          {loading ? (
            <div className="loading">Loading questions...</div>
          ) : filteredQuestions.length === 0 ? (
            <div className="no-questions">No questions found matching your filters.</div>
          ) : (
            <div className="questions-grid">
              {filteredQuestions.map((question) => (
                <div key={question._id} className="question-card">
                  <div className="question-header">
                    <h3>{question.question}</h3>
                    {question.company && (
                      <span className="company-badge">{question.company}</span>
                    )}
                  </div>
                  
                  {question.tags && question.tags.length > 0 && (
                    <div className="tags">
                      {question.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="question-meta">
                    <span className="author">by {question.user?.name || 'Anonymous'}</span>
                    <span className="date">{formatDate(question.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .interview-bank-page {
          min-height: 80vh;
          background: #f7fafc;
          padding: 2rem 1rem;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .interview-bank-page h1 {
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
        .add-question-section,
        .filters-section,
        .questions-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .section-header h2 {
          color: #2d3748;
          font-size: 1.5rem;
          margin: 0;
        }
        .toggle-btn {
          background: #3182ce;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .toggle-btn:hover {
          background: #225ea8;
        }
        .add-question-form {
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
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
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
        .filters-section h2 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .filters {
          display: flex;
          gap: 2rem;
          align-items: end;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .filter-group label {
          font-weight: 600;
          color: #2d3748;
        }
        .filter-stats {
          color: #718096;
          font-size: 0.9rem;
        }
        .questions-section h2 {
          color: #2d3748;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        .loading,
        .no-questions {
          text-align: center;
          color: #718096;
          padding: 2rem;
        }
        .questions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }
        .question-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .question-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .question-header h3 {
          color: #2d3748;
          font-size: 1.1rem;
          line-height: 1.5;
          margin: 0;
          flex: 1;
          margin-right: 1rem;
        }
        .company-badge {
          background: #e6f0fa;
          color: #3182ce;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .tag {
          background: #f7fafc;
          color: #4a5568;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .question-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #718096;
        }
        @media (max-width: 768px) {
          .filters {
            flex-direction: column;
            gap: 1rem;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .questions-grid {
            grid-template-columns: 1fr;
          }
          .interview-bank-page h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default InterviewBank; 