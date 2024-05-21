// src/App.js
// do not remove imports
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ForgotPassword from './pages/ForgotPassword'; // Added this import
import HomePage from './pages/HomePage'; // Added this import
import UserProfile from './pages/UserProfile'; // Added this import

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
              <Route path="/edit-profile" element={<PrivateRoute component={EditProfile} />} />
              <Route path="/post-ad" element={<PrivateRoute component={PostAd} />} />
              <Route path="/ads" element={<AdsPage />} />
              <Route path="/favourites" element={<PrivateRoute component={Favourites} />} />
              <Route path="/ad/:id" element={<AdDetail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Added this route */}
              <Route path="/homepage" element={<HomePage />} /> {/* Added this route */}
              <Route path="/userprofile" element={<PrivateRoute component={UserProfile} />} /> {/* Added this route */}
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
