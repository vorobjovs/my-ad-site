// src/pages/AdsPage.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AdsPage.css';

const AdsPage = () => {
  const { currentUser } = useAuth();
  const [ads, setAds] = useState([]);
  const [users, setUsers] = useState({});
  const [favouritedAds, setFavouritedAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      const adsSnapshot = await getDocs(collection(db, 'ads'));
      const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch user data for each ad
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

    const fetchFavourites = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFavouritedAds(userData.favourites || []);
        }
      }
    };

    fetchAds();
    fetchFavourites();
  }, [currentUser]);

  const handleFavourite = async (adId) => {
    if (!currentUser) return alert('You need to log in to favourite ads.');

    const userDocRef = doc(db, 'users', currentUser.uid);
    const adIsFavourited = favouritedAds.includes(adId);

    if (adIsFavourited) {
      await updateDoc(userDocRef, {
        favourites: arrayRemove(adId)
      });
      setFavouritedAds(favouritedAds.filter(id => id !== adId));
    } else {
      await updateDoc(userDocRef, {
        favourites: arrayUnion(adId)
      });
      setFavouritedAds([...favouritedAds, adId]);
    }
  };

  return (
    <div className="ads-page">
      <h1>Ads</h1>
      <div className="ads-list">
        {ads.map(ad => (
          <div key={ad.id} className="ad-item">
            <div className="ad-header">
              <img src={users[ad.userId]?.profilePictureUrl || 'default-profile.png'} alt="User Profile" className="ad-user-image" />
              <Link to={`/profile/${ad.userId}`} className="ad-user-name">{users[ad.userId]?.name || 'Unknown User'}</Link>
            </div>
            <div className="ad-content">
              <h2>{ad.title}</h2>
              <p>{ad.description}</p>
              <p><strong>Price: </strong>{ad.price}</p>
              <div className="ad-photos">
                {ad.photos.map((url, index) => (
                  <img key={index} src={url} alt={`Ad Photo ${index}`} />
                ))}
              </div>
              <Link to={`/ad/${ad.id}`} className="view-button">View</Link>
              <button 
                className="favourite-button" 
                onClick={() => handleFavourite(ad.id)}
              >
                {favouritedAds.includes(ad.id) ? 'Unfavourite' : 'Favourite'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsPage;
