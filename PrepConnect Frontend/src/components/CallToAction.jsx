import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="cta">
      <div className="cta-content">
        <h2>Ready to Boost Your Career?</h2>
        <p>Join thousands of professionals who are already using PrepConnect to ace their interviews and advance their careers.</p>
        <Link to="/signup" className="cta-button">
          Join PrepConnect Now
        </Link>
      </div>

      <style>{`
        .cta {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        .cta-content {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 0 auto;
        }
        .cta h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .cta p {
          font-size: 1.2rem;
          margin: 0 0 2rem 0;
          line-height: 1.6;
          opacity: 0.95;
        }
        .cta-button {
          display: inline-block;
          background: #ffe066;
          color: #2d3748;
          padding: 1rem 2.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          border: none;
          cursor: pointer;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          background: #fbbf24;
        }
        .cta-button:active {
          transform: translateY(0);
        }
        @media (max-width: 768px) {
          .cta {
            padding: 3rem 1rem;
          }
          .cta h2 {
            font-size: 2rem;
          }
          .cta p {
            font-size: 1.1rem;
          }
          .cta-button {
            padding: 0.875rem 2rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default CallToAction; 