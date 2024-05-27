// src/pages/AdDetail.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './AdDetail.css';
import { CaretRightFilled, CaretLeftFilled } from '@ant-design/icons';


const AdDetail = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      const docRef = doc(db, 'ads', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const adData = docSnap.data();
        setAd(adData);

        // Fetch user data
        const userRef = doc(db, 'users', adData.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          console.log('No such user document!');
        }
      } else {
        console.log('No such ad document!');
      }
    };

    fetchAd();
  }, [id]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? ad.photos.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === ad.photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!ad || !user) return <p>Loading...</p>;

  return (
    <div className="ad-detail-container">
      <h1>{ad.title}</h1>
      <h3>{ad.category}</h3>
      <div className="ad-image-container">
        <button className="ad-image-button ad-image-button-prev" onClick={handlePrevImage}><CaretLeftFilled /></button>
        <img src={ad.photos[currentImageIndex]} alt={ad.title} className="ad-detail-image" />
        <button className="ad-image-button ad-image-button-next" onClick={handleNextImage}><CaretRightFilled /></button>
      </div>
      <div className="ad-info">
        <div className="ad-author">
          <img src={user.profilePictureUrl || 'default-profile.png'} alt="User Profile" className="ad-user-image" />
          <p>{user.name || 'Unknown User'}</p>
        </div>
        <div className="ad-price">
          <p>Price: ${ad.price}</p>
        </div>
        <button className="offer-button">Offer</button>
      </div>
      <p className="ad-description">{ad.description}</p>
    </div>
  );
};

export default AdDetail;
