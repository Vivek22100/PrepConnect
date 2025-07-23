import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setLoginError('');
      
      try {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          // Redirect to home page after successful login
          navigate('/');
        } else {
          setLoginError(result.error || 'Login failed. Please try again.');
        }
      } catch (error) {
        setLoginError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to your PrepConnect account</p>
        
        {loginError && (
          <div className="error-banner">
            {loginError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="signup-link">
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
        }
        .login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
        }
        .login-card h1 {
          text-align: center;
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
        }
        .subtitle {
          text-align: center;
          color: #718096;
          margin-bottom: 2rem;
        }
        .error-banner {
          background: #fed7d7;
          color: #c53030;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 500;
        }
        .login-form {
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
          color: #4a5568;
        }
        .form-group input {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .form-group input:focus {
          outline: none;
          border-color: #3182ce;
        }
        .form-group input.error {
          border-color: #f56565;
        }
        .error-message {
          color: #f56565;
          font-size: 0.875rem;
        }
        .login-btn {
          background: #3182ce;
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .login-btn:hover:not(:disabled) {
          background: #2c5aa0;
        }
        .login-btn:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }
        .signup-link {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }
        .signup-link a {
          color: #3182ce;
          text-decoration: none;
          font-weight: 600;
        }
        .signup-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login; 