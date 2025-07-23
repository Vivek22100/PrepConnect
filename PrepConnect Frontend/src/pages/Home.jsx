import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Experience Sharing',
    desc: 'Share and discover real interview experiences from peers.',
    icon: '📝',
    link: '/experience-sharing',
  },
  {
    title: 'Mock Interviews',
    desc: 'Schedule and practice with seniors for real feedback.',
    icon: '🎤',
    link: '/mock-interview',
  },
  {
    title: 'Chat',
    desc: 'Connect and chat with mentors and peers instantly.',
    icon: '💬',
    link: '/chat',
  },
  {
    title: 'Q-Bank',
    desc: 'Access a community-driven interview question bank.',
    icon: '📚',
    link: '/interview-bank',
  },
  {
    title: 'Experience Map',
    desc: 'Visualize and explore the journeys of different professionals.',
    icon: '🗺️',
    link: '/experience-map',
  },
];

const steps = [
  {
    title: 'Sign Up',
    desc: 'Create your free PrepConnect account in seconds.',
    icon: '1',
  },
  {
    title: 'Connect & Explore',
    desc: 'Find mentors, join mock interviews, and explore experiences.',
    icon: '2',
  },
  {
    title: 'Get Interview-Ready',
    desc: 'Practice, learn, and ace your next interview!',
    icon: '3',
  },
];

const testimonials = [
  {
    name: 'Amit S.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    stars: 5,
    text: 'PrepConnect helped me land my dream job! The mock interviews and real experiences were invaluable.',
  },
  {
    name: 'Priya K.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    stars: 5,
    text: 'The mentorship and Q-Bank features are amazing. I felt so much more confident going into interviews.',
  },
  {
    name: 'Rahul D.',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    stars: 4,
    text: 'Great platform for connecting with seniors and practicing interviews. Highly recommend!',
  },
];

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero fade-in">
        <h1>Get Interview-Ready with <span className="brand">PrepConnect</span></h1>
        <p>Connect, practice, and succeed with India's most supportive interview prep community.</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
          <Link to="/explore" className="btn btn-secondary">Explore Experiences</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features fade-in">
        <h2>What You Get</h2>
        <div className="features-grid">
          {features.map((f) => (
            <Link to={f.link} className="feature-card" key={f.title} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works fade-in">
        <h2>How It Works</h2>
        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.title}>
              <div className="step-icon">{s.icon}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials fade-in">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <img src={t.avatar} alt={t.name} className="avatar" />
              <div className="stars">{'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}</div>
              <p className="feedback">{t.text}</p>
              <div className="user">- {t.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="final-cta fade-in">
        <h2>Ready to level up your interview prep?</h2>
        <Link to="/signup" className="btn btn-primary">Join PrepConnect Now</Link>
      </section>

      {/* Minimal CSS for layout and fade-in animation */}
      <style>{`
        .home-page { font-family: 'Segoe UI', sans-serif; color: #222; }
        .hero {
          text-align: center;
          padding: 4rem 1rem 3rem 1rem;
          background: linear-gradient(90deg, #3182ce 0%, #63b3ed 100%);
          color: #fff;
        }
        .hero .brand { color: #ffe066; }
        .hero .cta-buttons { margin-top: 2rem; }
        .btn {
          padding: 0.75rem 2rem;
          border-radius: 4px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          text-decoration: none;
          margin: 0 0.5rem;
          display: inline-block;
        }
        .btn-primary { background: #ffe066; color: #222; }
        .btn-secondary { background: #fff; color: #3182ce; border: 1px solid #3182ce; }
        .features { padding: 3rem 1rem; background: #f7fafc; text-align: center; }
        .features-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
          margin-top: 2rem;
        }
        .feature-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 2rem 1.5rem;
          width: 220px;
          text-align: center;
          transition: transform 0.2s;
        }
        .feature-card:hover { transform: translateY(-6px) scale(1.03); }
        .feature-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .how-it-works { padding: 3rem 1rem; text-align: center; }
        .steps {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
          margin-top: 2rem;
        }
        .step {
          background: #e6f0fa;
          border-radius: 8px;
          padding: 1.5rem 1rem;
          width: 200px;
        }
        .step-icon {
          background: #3182ce;
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          margin: 0 auto 1rem auto;
        }
        .testimonials { padding: 3rem 1rem; background: #f7fafc; text-align: center; }
        .testimonials-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
          margin-top: 2rem;
        }
        .testimonial-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 2rem 1.5rem;
          width: 260px;
          text-align: center;
        }
        .avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          margin-bottom: 1rem;
        }
        .stars { color: #ffe066; font-size: 1.2rem; margin-bottom: 0.5rem; }
        .feedback { font-style: italic; margin-bottom: 0.5rem; }
        .user { color: #3182ce; font-weight: 600; }
        .final-cta {
          background: linear-gradient(90deg, #3182ce 0%, #63b3ed 100%);
          color: #fff;
          text-align: center;
          padding: 3rem 1rem;
        }
        .final-cta .btn-primary { background: #ffe066; color: #222; margin-top: 1rem; }
        /* Fade-in animation */
        .fade-in { opacity: 0; transform: translateY(30px); animation: fadeInUp 1s forwards; }
        .fade-in:nth-child(1) { animation-delay: 0.1s; }
        .fade-in:nth-child(2) { animation-delay: 0.3s; }
        .fade-in:nth-child(3) { animation-delay: 0.5s; }
        .fade-in:nth-child(4) { animation-delay: 0.7s; }
        .fade-in:nth-child(5) { animation-delay: 0.9s; }
        @keyframes fadeInUp {
          to { opacity: 1; transform: none; }
        }
        @media (max-width: 900px) {
          .features-grid, .testimonials-grid, .steps {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Home; 