// src/components/ProfilePictureUpload.js

import React, { useState } from 'react';
import { storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './ProfilePictureUpload.css';

const ProfilePictureUpload = () => {
  const { currentUser } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

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

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optional: Handle upload progress if needed
        },
        (error) => {
          console.error("Error uploading profile picture:", error);
          setUploading(false);
          setError("Error uploading profile picture. Please try again later.");
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setProfilePictureUrl(downloadURL);
            await updateDoc(doc(db, 'users', currentUser.uid), {
              profilePictureUrl: downloadURL,
            });
            setUploading(false);
            alert('Profile picture updated successfully!');
          } catch (error) {
            console.error("Error getting download URL or updating Firestore:", error);
            setError("Error finalizing profile picture upload. Please try again later.");
            setUploading(false);
          }
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (profilePicture) {
      handleUpload();
    } else {
      setError('Please select a profile picture to upload.');
    }
  };

  return (
    <div className="profile-picture-upload-container">
      <h2>Upload Profile Picture</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleProfilePictureChange} />
        {profilePictureUrl && <img src={profilePictureUrl} alt="Profile" className="profile-picture" />}
        {uploading && <p>Uploading...</p>}
        <button type="submit" disabled={uploading}>Upload</button>
      </form>
    </div>
  );
};

export default ProfilePictureUpload;
