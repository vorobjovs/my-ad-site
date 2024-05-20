// src/pages/AdsPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import './AdsPage.css';
import { useAuth } from '../contexts/AuthContext';

const AdsPage = () => {
  const { currentUser } = useAuth();
  const [ads, setAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAds = async () => {
      const querySnapshot = await getDocs(collection(db, 'ads'));
      const adsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAds(adsList);
    };

    fetchAds();
  }, []);

  const filteredAds = ads.filter(ad => 
    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFavourite = async (adId) => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const updatedFavourites = userData.favourites ? [...userData.favourites, adId] : [adId];
        await setDoc(userRef, { favourites: updatedFavourites }, { merge: true });
        alert('Ad added to favourites!');
      }
    } catch (error) {
      console.error('Error adding to favourites:', error);
    }
  };

  return (
    <div className="ads-container">
      <h1>Ad Listings</h1>
      <input 
        type="text" 
        placeholder="Search ads..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="search-bar"
      />
      <div className="ads-grid">
        {filteredAds.map(ad => (
          <div className="ad-card" key={ad.id}>
            <img src={ad.photos[0]} alt={ad.title} className="ad-image" />
            <h2>{ad.title}</h2>
            <p>{ad.price}</p>
            <Link to={`/ad/${ad.id}`} className="view-button">View</Link>
            <button 
              className="favourite-button"
              onClick={() => handleFavourite(ad.id)}
            >
              Favourite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsPage;
