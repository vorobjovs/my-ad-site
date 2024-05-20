// src/pages/EditProfile.js

import React, { useState, useEffect, useCallback } from 'react';
import { db, storage } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import './EditProfile.css';

const EditProfile = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [bio, setBio] = useState('');
  const [profileCategory, setProfileCategory] = useState('');
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
        setProfileCategory(data.profileCategory || '');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error getting document:', error);
      setError('Error loading user profile. Please try again later.');
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser, loadUserProfile]);

  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    if (profilePicture) {
      console.log("Starting upload process...");
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}/${profilePicture.name}`);
      const uploadTask = uploadBytesResumable(storageRef, profilePicture);
  
      setUploading(true);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optional: Handle upload progress if needed
          console.log(`Upload is ${snapshot.bytesTransferred / snapshot.totalBytes * 100}% done`);
        },
        (error) => {
          console.error('Error uploading profile picture:', error);
          setUploading(false);
          setError('Error uploading profile picture. Please try again later.');
        },
        async () => {
          console.log("Upload completed, getting download URL...");
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Download URL obtained:", downloadURL);
            setProfilePictureUrl(downloadURL);
            await saveUserProfile(downloadURL);
            setUploading(false);
            alert('Profile picture updated successfully!');
          } catch (error) {
            console.error('Error getting download URL or updating Firestore:', error);
            setError('Error finalizing profile picture upload. Please try again later.');
            setUploading(false);
          }
        }
      );
    } else {
      setError('Please select a profile picture to upload.');
    }
  };
  


  const saveUserProfile = async (profilePictureUrl = '') => {
    console.log("Saving user profile with URL:", profilePictureUrl);
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        docRef,
        {
          name,
          email,
          profilePictureUrl,
          bio,
          profileCategory,
        },
        { merge: true }
      );
      console.log("User profile saved successfully");
      alert('Profile updated!');
    } catch (error) {
      console.error('Error saving document:', error);
      setError('Error saving user profile. Please try again later.');
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    if (profilePicture) {
      console.log("Profile picture selected, starting upload...");
      handleUpload();
    } else {
      console.log("No profile picture selected, saving profile...");
      saveUserProfile(profilePictureUrl);
    }
  };
  

  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>
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
          <textarea value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
          <label>Profile Category</label>
          <input type="text" value={profileCategory} onChange={(e) => setProfileCategory(e.target.value)} />
          <button type="submit" disabled={uploading}>Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
