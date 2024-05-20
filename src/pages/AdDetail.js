// src/pages/AdDetail.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './AdDetail.css';

const AdDetail = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      const docRef = doc(db, 'ads', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setAd(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchAd();
  }, [id]);

  if (!ad) return <p>Loading...</p>;

  return (
    <div className="ad-detail-container">
      <h1>{ad.title}</h1>
      <img src={ad.photos[0]} alt={ad.title} className="ad-detail-image" />
      <p>{ad.description}</p>
      <p>Price: {ad.price}</p>
      <p>Category: {ad.category}</p>
      <p>Posted by: {ad.userId}</p>
    </div>
  );
};

export default AdDetail;
