// src/components/Navigation.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

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
        <li><button onClick={() => navigate('/profile')}>Profile</button></li>
        <li><button onClick={() => navigate('/post-ad')}>Post Ad</button></li>
        <li><button onClick={() => navigate('/ads')}>Ads</button></li>
        <li><button onClick={() => navigate('/favourites')}>Favourites</button></li>
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
