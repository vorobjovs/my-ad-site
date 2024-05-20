// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import EditProfile from './pages/EditProfile';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import PostAd from './pages/PostAd';
import AdsPage from './pages/AdsPage';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import SimpleUpload from './components/SimpleUpload';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import AdDetail from './pages/AdDetail';
import Favourites from './pages/Favourites';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navigation />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/simple-upload" element={<SimpleUpload />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<PrivateRoute component={UserDashboard} />} />
              <Route path="/edit-profile" element={<PrivateRoute component={EditProfile} />} />
              <Route path="/post-ad" element={<PrivateRoute component={PostAd} />} />
              <Route path="/ads" element={<AdsPage />} />
              <Route path="/favourites" element={<PrivateRoute component={Favourites} />} />
              <Route path="/ad/:id" element={<AdDetail />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
