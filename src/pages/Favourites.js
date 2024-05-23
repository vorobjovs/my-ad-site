// src/pages/Favourites.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Favourites.css';

const Favourites = () => {
  const { currentUser } = useAuth();
  const [favouritedAds, setFavouritedAds] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchFavourites = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const favouriteAdIds = userData.favourites || [];

          const adPromises = favouriteAdIds.map(adId => getDoc(doc(db, 'ads', adId)));
          const adDocs = await Promise.all(adPromises);
          const adsList = adDocs.map(adDoc => ({ id: adDoc.id, ...adDoc.data() }));

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
          setFavouritedAds(adsList);
        }
      }
    };

    fetchFavourites();
  }, [currentUser]);

  return (
    <div className="favourites-page">
      <h1>Favourites</h1>
      <div className="ads-list">
        {favouritedAds.map(ad => (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
