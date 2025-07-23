import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleToggle = () => setMenuOpen((prev) => !prev);
  const handleClose = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">PrepConnect</Link>
        <button className="hamburger" onClick={handleToggle} aria-label="Toggle menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" onClick={handleClose}>Home</NavLink></li>
          <li><NavLink to="/features" onClick={handleClose}>Features</NavLink></li>
          <li><NavLink to="/explore" onClick={handleClose}>Explore</NavLink></li>
          <li><NavLink to="/connect" onClick={handleClose}>Connect</NavLink></li>
          
          {user ? (
            <>
              <li><NavLink to="/profiles" onClick={handleClose}>User Profiles</NavLink></li>
              <li><NavLink to="/chat" onClick={handleClose}>Chat</NavLink></li>
              <li className="user-menu">
                <span className="user-name">Hi, {user.name}</span>
                <button className="btn btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" className="btn btn-login" onClick={handleClose}>Login</NavLink></li>
              <li><NavLink to="/signup" className="btn btn-signup" onClick={handleClose}>Signup</NavLink></li>
            </>
          )}
        </ul>
      </div>
      <style>{`
        .navbar {
          background: #fff;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.5rem 1rem;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2d3748;
          text-decoration: none;
        }
        .nav-links {
          display: flex;
          gap: 1rem;
          list-style: none;
          align-items: center;
        }
        .nav-links li a {
          text-decoration: none;
          color: #2d3748;
          font-weight: 500;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .nav-links li a.active {
          background: #f0f0f0;
        }
        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-name {
          color: #3182ce;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .btn {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn-login {
          background: #fff;
          color: #3182ce;
          border: 1px solid #3182ce;
        }
        .btn-signup {
          background: #3182ce;
          color: #fff;
          margin-left: 0.5rem;
        }
        .btn-logout {
          background: #f56565;
          color: #fff;
          font-size: 0.9rem;
        }
        .btn-logout:hover {
          background: #e53e3e;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .bar {
          width: 25px;
          height: 3px;
          background: #2d3748;
          border-radius: 2px;
        }
        @media (max-width: 768px) {
          .nav-links {
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            background: #fff;
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
            padding: 1rem 2rem;
            display: none;
          }
          .nav-links.open {
            display: flex;
          }
          .nav-links li {
            width: 100%;
            margin-bottom: 0.5rem;
          }
          .user-menu {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .hamburger {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 