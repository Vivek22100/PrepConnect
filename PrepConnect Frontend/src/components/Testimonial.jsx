import React, { useState } from 'react';

const Testimonial = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Default testimonials if none provided
  const defaultTestimonials = [
    {
      id: 1,
      name: "Amit Sharma",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "PrepConnect helped me land my dream job at Google! The mock interviews and real experiences were invaluable.",
      rating: 5,
      role: "Senior Developer",
      company: "Google"
    },
    {
      id: 2,
      name: "Priya Kumar",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "The mentorship and Q-Bank features are amazing. I felt so much more confident going into interviews.",
      rating: 5,
      role: "Product Manager",
      company: "Microsoft"
    },
    {
      id: 3,
      name: "Rahul Desai",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
      text: "Great platform for connecting with seniors and practicing interviews. Highly recommend!",
      rating: 4,
      role: "Software Engineer",
      company: "Amazon"
    },
    {
      id: 4,
      name: "Neha Patel",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      text: "The community is incredibly supportive. Found my mentor here and got amazing interview tips.",
      rating: 5,
      role: "Frontend Developer",
      company: "Meta"
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? 'filled' : 'empty'}`}>
        ★
      </span>
    ));
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  };

  return (
    <div className="testimonials-container">
      <h2 className="testimonials-title">What Our Users Say</h2>
      
      {/* Desktop Grid View */}
      <div className="testimonials-grid">
        {displayTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-header">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=3182ce&color=fff&size=64`;
                }}
              />
              <div className="user-info">
                <h4 className="user-name">{testimonial.name}</h4>
                <p className="user-role">{testimonial.role} at {testimonial.company}</p>
              </div>
            </div>
            
            <div className="rating">
              {renderStars(testimonial.rating)}
            </div>
            
            <blockquote className="testimonial-text">
              "{testimonial.text}"
            </blockquote>
          </div>
        ))}
      </div>

      {/* Mobile Carousel View */}
      <div className="testimonials-carousel">
        <button className="carousel-btn prev" onClick={prevTestimonial}>
          ‹
        </button>
        
        <div className="carousel-content">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <img 
                src={displayTestimonials[currentIndex].avatar} 
                alt={displayTestimonials[currentIndex].name} 
                className="avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${displayTestimonials[currentIndex].name}&background=3182ce&color=fff&size=64`;
                }}
              />
              <div className="user-info">
                <h4 className="user-name">{displayTestimonials[currentIndex].name}</h4>
                <p className="user-role">{displayTestimonials[currentIndex].role} at {displayTestimonials[currentIndex].company}</p>
              </div>
            </div>
            
            <div className="rating">
              {renderStars(displayTestimonials[currentIndex].rating)}
            </div>
            
            <blockquote className="testimonial-text">
              "{displayTestimonials[currentIndex].text}"
            </blockquote>
          </div>
        </div>
        
        <button className="carousel-btn next" onClick={nextTestimonial}>
          ›
        </button>
        
        <div className="carousel-dots">
          {displayTestimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      <style>{`
        .testimonials-container {
          padding: 3rem 1rem;
          background: #f7fafc;
        }
        .testimonials-title {
          text-align: center;
          font-size: 2rem;
          color: #2d3748;
          margin-bottom: 2rem;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .testimonial-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid #e2e8f0;
        }
        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .testimonial-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-right: 1rem;
          object-fit: cover;
        }
        .user-info {
          flex: 1;
        }
        .user-name {
          margin: 0 0 0.25rem 0;
          color: #2d3748;
          font-size: 1.1rem;
          font-weight: 600;
        }
        .user-role {
          margin: 0;
          color: #718096;
          font-size: 0.9rem;
        }
        .rating {
          margin-bottom: 1rem;
        }
        .star {
          font-size: 1.2rem;
          margin-right: 0.25rem;
        }
        .star.filled {
          color: #fbbf24;
        }
        .star.empty {
          color: #e2e8f0;
        }
        .testimonial-text {
          margin: 0;
          color: #4a5568;
          font-style: italic;
          line-height: 1.6;
          font-size: 1rem;
        }
        .testimonials-carousel {
          display: none;
          position: relative;
          max-width: 500px;
          margin: 0 auto;
        }
        .carousel-content {
          position: relative;
        }
        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.5rem;
          color: #4a5568;
          z-index: 2;
          transition: all 0.2s;
        }
        .carousel-btn:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
        }
        .carousel-btn.prev {
          left: -20px;
        }
        .carousel-btn.next {
          right: -20px;
        }
        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: #cbd5e0;
          cursor: pointer;
          transition: background 0.2s;
        }
        .dot.active {
          background: #3182ce;
        }
        @media (max-width: 768px) {
          .testimonials-grid {
            display: none;
          }
          .testimonials-carousel {
            display: block;
          }
          .testimonials-title {
            font-size: 1.5rem;
          }
          .testimonial-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Testimonial; 