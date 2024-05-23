// src/pages/Favourites.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Favourites.css';
import { useAuth } from '../contexts/AuthContext';

const Favourites = () => {
  const [favouriteAds, setFavouriteAds] = useState([]);
  const [users, setUsers] = useState({});
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchFavouriteAds = async () => {
      if (!currentUser) return;
      
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favouritedAdsIds = userData.favouritedAds || [];

        const adsPromises = favouritedAdsIds.map(async (adId) => {
          const adDoc = await getDoc(doc(db, 'ads', adId));
          return { id: adDoc.id, ...adDoc.data() };
        });

        const adsList = await Promise.all(adsPromises);

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
        setFavouriteAds(adsList);
      }
    };

    fetchFavouriteAds();
  }, [currentUser]);

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
    <div className="favourites-page">
      <h1>Favourites</h1>
      <div className="ads-grid">
        {favouriteAds.map(ad => (
          <div key={ad.id} className="ad-item">
            <div className="ad-header">
              <Link to={`/ad/${ad.id}`}>
                <img src={ad.photos[0]} alt="Ad image" className="ad-image" />
              </Link>
              <button
                className={`favourite-button ${currentUser?.favouritedAds?.includes(ad.id) ? 'favourited' : ''}`}
                onClick={() => handleFavourite(ad.id)}>
                {currentUser?.favouritedAds?.includes(ad.id) ? 'A' : 'B'}
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

export default Favourites;
