// src/pages/MyAds.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './AdsPage.css'; // Reusing styles from AdsPage

const MyAds = () => {
  const [ads, setAds] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMyAds = async () => {
      if (!currentUser) return;

      const q = query(collection(db, 'ads'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const adsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setAds(adsList);
    };

    fetchMyAds();
  }, [currentUser]);

  return (
    <div className="ads-page">
      <h1>My Ads</h1>
      <div className="ads-grid">
        {ads.map(ad => (
          <div key={ad.id} className="ad-item">
            <div className="ad-header">
              <Link to={`/ad/${ad.id}`}>
                <img src={ad.photos[0]} alt="Ad image" className="ad-image" />
              </Link>
            </div>
            <div className="ad-content">
              <h2>{ad.title}</h2>
              <div className="ad-user-info">
                <img src={currentUser.profilePictureUrl || 'default-profile.png'} alt="User Profile" className="ad-user-image" />
                <span>{currentUser.name || 'Unknown User'}</span>
              </div>
              <p className="ad-price">{`$${ad.price}`}</p>
              <Link to={`/ad/${ad.id}`} className="view-button">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAds;
