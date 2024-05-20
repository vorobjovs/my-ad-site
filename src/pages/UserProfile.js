import React, { useState, useEffect, useCallback } from 'react';
import { db, storage } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [bio, setBio] = useState('');
  const [adsPosted, setAdsPosted] = useState(0);
  const [closedAds, setClosedAds] = useState(0);
  const [favouritedAds, setFavouritedAds] = useState(0);
  const [contacts, setContacts] = useState(0);
  const [messages, setMessages] = useState(0);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [verified, setVerified] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const loadUserProfile = useCallback(async () => {
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || '');
        setEmail(data.email || '');
        setProfilePictureUrl(data.profilePictureUrl || '');
        setBio(data.bio || '');
        setAdsPosted(data.adsPosted || 0);
        setClosedAds(data.closedAds || 0);
        setFavouritedAds(data.favouritedAds || 0);
        setContacts(data.contacts || 0);
        setMessages(data.messages || 0);
        setOnlineStatus(data.onlineStatus || false);
        setVerified(data.verified || false);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
      setError("Error loading user profile. Please try again later.");
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser, loadUserProfile]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (profilePicture) {
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}/${profilePicture.name}`);
      const uploadTask = uploadBytesResumable(storageRef, profilePicture);

      setUploading(true);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Handle progress
        },
        (error) => {
          console.error(error);
          setUploading(false);
          setError("Error uploading profile picture. Please try again later.");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setProfilePictureUrl(downloadURL);
            saveUserProfile(downloadURL);
            setUploading(false);
          });
        }
      );
    }
  };

  const saveUserProfile = async (profilePictureUrl = '') => {
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, {
        name,
        email,
        profilePictureUrl,
        bio,
        adsPosted,
        closedAds,
        favouritedAds,
        contacts,
        messages,
        onlineStatus,
        verified
      }, { merge: true });
      alert('Profile updated!');
    } catch (error) {
      console.error("Error saving document:", error);
      setError("Error saving user profile. Please try again later.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (profilePicture) {
      handleUpload();
    } else {
      saveUserProfile(profilePictureUrl);
    }
  };

  return (
    <div className="user-profile-container">
      <div className="sidebar">
        <ul>
          <li>Dashboard</li>
          <li>Accounts</li>
          <li>Mobile</li>
          <li>Payments</li>
          <li>Companies</li>
          <li>Supports</li>
        </ul>
      </div>
      <div className="user-profile-content">
        <div className="header">
          <h1>My dashboard</h1>
          <div className="user-info">
            <span>Hello {name}</span>
            {profilePictureUrl && <img src={profilePictureUrl} alt="Profile" className="header-profile-picture" />}
          </div>
        </div>
        <div className="profile-card">
          <h3>My profile</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="profile-picture-container">
              {profilePictureUrl && <img src={profilePictureUrl} alt="Profile" className="profile-picture" />}
              <input type="file" onChange={handleProfilePictureChange} />
              {uploading && <p>Uploading...</p>}
            </div>
            <div className="profile-info">
              <label>Username</label>
              <input type="text" value={name} readOnly />
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <label>Bio</label>
              <textarea value={bio} onChange={handleBioChange}></textarea>
              <button type="submit" disabled={uploading}>Save</button>
            </div>
          </form>
        </div>
        <div className="stats-cards">
          <div className="stats-card">
            <h3>Profile Statistics</h3>
            <ul>
              <li>Ads Posted: {adsPosted}</li>
              <li>Closed Ads: {closedAds}</li>
              <li>Favourited Ads: {favouritedAds}</li>
              <li>Contacts: {contacts}</li>
              <li>Messages: {messages}</li>
              <li>Online Status: {onlineStatus ? 'Online' : 'Offline'}</li>
              <li>Verified: {verified ? 'Yes' : 'No'}</li>
            </ul>
          </div>
          <div className="stats-card">
            <h3>My play accounts</h3>
            <ul>
              <li>Active accounts: {adsPosted}</li>
              <li>Deactivated accounts: {closedAds}</li>
            </ul>
          </div>
          <div className="stats-card">
            <h3>My Activity</h3>
            <ul>
              <li>Ads Posted: {adsPosted}</li>
              <li>Closed Ads: {closedAds}</li>
              <li>Favourite Ads: {favouritedAds}</li>
              <li>Contacts: {contacts}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
const saveUserProfile = async (profilePictureUrl = '') => {
  try {
    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, {
      name,
      email,
      profilePictureUrl,
      bio,
      profileCategory,
      role: 'seller', // or 'buyer'
      verified: false,
    }, { merge: true });
    alert('Profile updated!');
  } catch (error) {
    console.error("Error saving document:", error);
    setError("Error saving user profile. Please try again later.");
  }
};

export default UserProfile;
