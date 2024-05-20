// src/pages/UserDashboard.js

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({}); // Initialize userData as an empty object

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  return (
    <div className="user-dashboard-container">
      <div className="user-info-section">
        {userData.profilePictureUrl && <img src={userData.profilePictureUrl} alt="Profile" className="profile-picture" />}
        <h2>{userData.name}</h2>
        <p>{userData.bio}</p>
        <p>Email: {userData.email}</p>
        <p>Profile Category: {userData.profileCategory}</p>
        <Link to="/edit-profile" className="edit-profile-button">Edit Profile</Link>
      </div>
      <div className="previous-work-section">
        <h3>Previous Work</h3>
        {/* Showcase previous work here */}
      </div>
      <div className="profile-stats-section">
        <div className="stat-card">
          <h3>Ads Posted</h3>
          <p>{userData.adsPosted}</p>
        </div>
        <div className="stat-card">
          <h3>Closed Ads</h3>
          <p>{userData.closedAds}</p>
        </div>
        <div className="stat-card">
          <h3>Favourited Ads</h3>
          <p>{userData.favouritedAds}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
