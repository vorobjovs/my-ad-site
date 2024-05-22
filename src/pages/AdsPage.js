// src/pages/AdsPage.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './AdsPage.css';

const AdsPage = () => {
  const [ads, setAds] = useState([]);
  const [users, setUsers] = useState({});

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

    fetchAds();
  }, []);

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
              <button className="favourite-button">Favourite</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsPage;