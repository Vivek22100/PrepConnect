import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Features from './pages/Features.jsx';
import Explore from './pages/Explore.jsx';
import Connect from './pages/Connect.jsx';
import UserProfiles from './pages/UserProfiles.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ExperienceDetails from './pages/ExperienceDetails.jsx';
import ExperienceSharing from './pages/ExperienceSharing.jsx';
import Chat from './pages/Chat.jsx';
import MockInterview from './pages/MockInterview.jsx';
import InterviewBank from './pages/InterviewBank.jsx';
import ExperienceMap from './pages/ExperienceMap.jsx';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/profiles" element={<UserProfiles />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/experience/:id" element={<ExperienceDetails />} />
            <Route path="/experience-sharing" element={<ExperienceSharing />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/mock-interview" element={<MockInterview />} />
            <Route path="/interview-bank" element={<InterviewBank />} />
            <Route path="/experience-map" element={<ExperienceMap />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App; 