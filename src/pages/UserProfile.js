import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    };

    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <img src={userData.profilePictureUrl || 'default-profile.png'} alt="Profile" className="profile-picture" />
        <h1>{userData.name}</h1>
        <p>{userData.email}</p>
        <p>{userData.bio}</p>
      </div>
      <div className="profile-actions">
        <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
        <button onClick={() => navigate('/my-ads')}>My Ads</button>
      </div>
    </div>
  );
};

export default UserProfile;
