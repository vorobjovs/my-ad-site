// src/pages/AdsPage.js

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './AdsPage.css';

const AdsPage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ads'));
        const adsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAds(adsData);
      } catch (error) {
        setError('Failed to load ads.');
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) return <p>Loading ads...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="ads-page">
      <h1>Ads</h1>
      <div className="ads-grid">
        {ads.map(ad => (
          <div key={ad.id} className="ad-card">
            <Link to={`/ad/${ad.id}`}>
              {ad.photos && ad.photos.length > 0 && (
                <img src={ad.photos[0]} alt={ad.title} className="ad-image" />
              )}
              <h3>{ad.title}</h3>
              <p>{ad.description}</p>
              <p>Price: ${ad.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsPage;
