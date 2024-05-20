// src/pages/Favourites.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './Favourites.css';

const Favourites = () => {
  const { currentUser } = useAuth();
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const fetchFavourites = async () => {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.favourites) {
          const adsRef = collection(db, 'ads');
          const q = query(adsRef, where('__name__', 'in', userData.favourites));
          const querySnapshot = await getDocs(q);
          const favouritesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFavourites(favouritesList);
        }
      }
    };

    fetchFavourites();
  }, [currentUser]);

  return (
    <div className="favourites-container">
      <h1>Favourites</h1>
      <div className="favourites-grid">
        {favourites.map(ad => (
          <div className="ad-card" key={ad.id}>
            <img src={ad.photos[0]} alt={ad.title} className="ad-image" />
            <h2>{ad.title}</h2>
            <p>{ad.price}</p>
            <Link to={`/ad/${ad.id}`} className="view-button">View</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
