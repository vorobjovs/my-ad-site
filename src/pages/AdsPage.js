// src/pages/AdsPage.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './AdsPage.css';
import { useAuth } from '../contexts/AuthContext';

const AdsPage = () => {
  const [ads, setAds] = useState([]);
  const [users, setUsers] = useState({});
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchAds = async () => {
      const adsSnapshot = await getDocs(collection(db, 'ads'));
      const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const userPromises = adsList.map(async (ad) => {
        const userDoc = await getDoc(doc(db, 'users', ad.userId));
        return { userId: ad.userId, userData: userDoc.data() };
      });

      const usersData = await Promise.all(userPromises);
      const usersMap = usersData.reduce((acc, user) => {
        acc[user.userId] = user.userData;
        return acc;
      }, {});

      setUsers(usersMap);
      setAds(adsList);
    };

    fetchAds();
  }, []);

  const handleFavourite = async (adId) => {
    if (!currentUser) {
      alert('Please log in to favourite ads.');
      return;
    }
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        let favouritedAds = userData.favouritedAds || [];
        if (!favouritedAds.includes(adId)) {
          favouritedAds = [...favouritedAds, adId];
          await setDoc(userRef, { favouritedAds }, { merge: true });
          setCurrentUser({ ...currentUser, favouritedAds });
          alert('Ad added to favourites!');
        } else {
          favouritedAds = favouritedAds.filter(id => id !== adId);
          await setDoc(userRef, { favouritedAds }, { merge: true });
          setCurrentUser({ ...currentUser, favouritedAds });
          alert('Ad removed from favourites.');
        }
      }
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };

  return (
    <div className="ads-page">
      <h1>Ads</h1>
      <div className="ads-grid">
        {ads.map(ad => (
          <div key={ad.id} className="ad-item">
            <div className="ad-header">
              <Link to={`/ad/${ad.id}`}>
                <img src={ad.photos[0]} alt="Ad image" className="ad-image" />
              </Link>
              <button
                className={`favourite-button ${currentUser?.favouritedAds?.includes(ad.id) ? 'favourited' : ''}`}
                onClick={() => handleFavourite(ad.id)}>
                {currentUser?.favouritedAds?.includes(ad.id) ? 'C' : 'D'}
              </button>
            </div>
            <div className="ad-content">
              <h2>{ad.title}</h2>
              <div className="ad-user-info">
                <Link to={`/profile/${ad.userId}`}>
                  <img src={users[ad.userId]?.profilePictureUrl || 'default-profile.png'} alt="User Profile" className="ad-user-image" />
                </Link>
                <Link to={`/profile/${ad.userId}`} className="ad-user-name">{users[ad.userId]?.name || 'Unknown User'}</Link>
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

export default AdsPage;
