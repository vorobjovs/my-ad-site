// src/components/Navigation.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';
// format navigation as buttons to allow for easier css formatting.
const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="navigation">
      <div className="navigation-header">
        <h2>My Ad Site</h2>
      </div>
      <ul>
        <li><button onClick={() => navigate('/')}>Home</button></li>
        <li><button onClick={() => navigate('/edit-profile')}>Edit Profile</button></li>
        <li><button onClick={() => navigate('/post-ad')}>Post Ad</button></li>
        <li><button onClick={() => navigate('/ads')}>Ads</button></li>
        <li><button onClick={() => navigate('/favourites')}>Favourites</button></li>
        <li><button onClick={() => navigate('/forgot-password')}>Forgot Password</button></li>
        <li><button onClick={() => navigate('/homepage')}>Home Page</button></li>
        <li><button onClick={() => navigate('/login')}>Login</button></li>
        <li><button onClick={() => navigate('/signup')}>Sign Up</button></li>
        <li><button onClick={() => navigate('/userdashboard')}>User Dashboard</button></li>
        <li><button onClick={() => navigate('/userprofile')}>User Profile</button></li>
        {currentUser ? (
          <li><button onClick={handleLogout}>Log Out</button></li>
        ) : (
          <>
            <li><button onClick={() => navigate('/signup')}>Sign Up</button></li>
            <li><button onClick={() => navigate('/login')}>Log In</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
