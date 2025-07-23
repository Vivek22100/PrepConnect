import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Experience Sharing',
    desc: 'Share your real interview stories and learn from others. Upvote, comment, and discover trending experiences.',
    icon: '📝',
    route: '/experience-sharing'
  },
  {
    title: 'Real-Time Chat',
    desc: 'Message mentors and peers instantly. Discuss strategies, ask questions, and build your network.',
    icon: '💬',
    route: '/chat'
  },
  {
    title: 'Mock Interview Scheduling',
    desc: 'Book mock interviews with seniors. Get actionable feedback and boost your confidence.',
    icon: '🎤',
    route: '/mock-interview'
  },
  {
    title: 'Interview Question Bank',
    desc: 'Access a crowd-sourced repository of real interview questions, filter by company or topic.',
    icon: '📚',
    route: '/interview-bank'
  },
  {
    title: 'Experience Map',
    desc: 'Visualize interview journeys and connections. See how others navigated their prep and success.',
    icon: '🗺️',
    route: '/experience-map'
  },
];

const Features = () => {
  return (
    <div className="features-page">
      <h1 className="features-title">Core Features</h1>
      <div className="features-list">
        {features.map((f) => (
          <Link to={f.route} key={f.title} className="feature-link">
            <div className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h2>{f.title}</h2>
              <p>{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <style>{`
        .features-page {
          padding: 2.5rem 1rem 2rem 1rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .features-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 2.5rem;
          color: #3182ce;
        }
        .features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
        }
        .feature-link {
          text-decoration: none;
          color: inherit;
        }
        .feature-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          padding: 2rem 1.5rem;
          width: 260px;
          text-align: center;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .feature-card:hover {
          transform: translateY(-8px) scale(1.04);
          box-shadow: 0 6px 24px rgba(49,130,206,0.13);
        }
        .feature-icon {
          font-size: 2.7rem;
          margin-bottom: 1.2rem;
        }
        .feature-card h2 {
          font-size: 1.3rem;
          color: #225ea8;
          margin-bottom: 0.7rem;
        }
        .feature-card p {
          color: #444;
          font-size: 1rem;
        }
        @media (max-width: 900px) {
          .features-list {
            flex-direction: column;
            align-items: center;
          }
          .feature-card {
            width: 90vw;
            max-width: 350px;
          }
        }
      `}</style>
    </div>
  );
};

export default Features; 