// src/pages/AdDetail.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './AdDetail.css';

const AdDetail = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [user, setUser] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchAd = async () => {
      const docRef = doc(db, 'ads', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const adData = docSnap.data();
        setAd(adData);
        
        const userRef = doc(db, 'users', adData.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }
      } else {
        console.log('No such document!');
      }
    };

    fetchAd();
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % ad.photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + ad.photos.length) % ad.photos.length);
  };

  if (!ad) return <p>Loading...</p>;

  return (
    <div className="ad-detail-container">
      <h1 className="ad-title">{ad.title}</h1>
      <p className="ad-category">{ad.category}</p>
      <div className="ad-image-container">
        <button className="image-nav-button prev" onClick={prevImage}>❮</button>
        <img src={ad.photos[currentImageIndex]} alt={ad.title} className="ad-detail-image" />
        <button className="image-nav-button next" onClick={nextImage}>❯</button>
      </div>
      <div className="ad-info">
        <img src={user?.profilePictureUrl || 'default-profile.png'} alt="Ad Author" className="ad-author-image" />
        <span className="ad-author">{user?.name || 'Unknown User'}</span>
        <span className="ad-price">${ad.price}</span>
        <button className="offer-button">Offer</button>
      </div>
      <p className="ad-description">{ad.description}</p>
    </div>
  );
};

export default AdDetail;
