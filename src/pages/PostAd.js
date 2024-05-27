// src/pages/PostAd.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import './PostAd.css';
import { CaretRightFilled, CaretLeftFilled } from '@ant-design/icons';

const PostAd = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoURLs, setPhotoURLs] = useState([]);
  const [verifiedUsersOnly, setVerifiedUsersOnly] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [blurThumbnail, setBlurThumbnail] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewIndex, setPreviewIndex] = useState(0);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPhotoURLs(urls);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPhotoURLs((prevURLs) => prevURLs.filter((_, i) => i !== index));
  };

  const handlePreviewChange = (index) => {
    setPreviewIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      // Upload photos to Firebase Storage
      const uploadedPhotos = await Promise.all(
        photos.map(async (photo) => {
          const storageRef = ref(storage, `adPhotos/${currentUser.uid}/${photo.name}`);
          const uploadTask = uploadBytesResumable(storageRef, photo);

          // Wait for the upload to complete
          await uploadTask;

          // Get the download URL for the uploaded file
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          return downloadURL;
        })
      );

      // Fetch the user's name and profile picture URL
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();

      // Save the ad information to Firestore
      await addDoc(collection(db, 'ads'), {
        title,
        description,
        price,
        category,
        photos: uploadedPhotos,
        previewImage: uploadedPhotos[previewIndex],
        userId: currentUser.uid,
        userName: userData.name,
        userProfilePicture: userData.profilePictureUrl,
        verifiedUsersOnly,
        requirements,
        blurThumbnail,
        createdAt: new Date(),
      });

      setSuccessMessage('Ad posted successfully!');
      setTimeout(() => {
        navigate('/ads');
      }, 2000);
    } catch (error) {
      console.error('Error posting ad:', error);
      alert('Error posting ad. Please try again later.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="post-ad-container">
      <h1>Post an Ad</h1>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        <label>Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <label>Category</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <label>Attach Photos or Media</label>
        <input type="file" multiple onChange={handlePhotoChange} />
        <div className="photo-preview">
          {photoURLs.map((url, index) => (
            <div key={index} className="photo-preview-item">
              <img
                src={url}
                alt={`Preview ${index}`}
                className={index === previewIndex ? 'selected' : ''}
                onClick={() => handlePreviewChange(index)}
              />
              <button type="button" onClick={() => handleRemovePhoto(index)}>Remove</button>
            </div>
          ))}
        </div>
        <label>
          <input
            type="checkbox"
            checked={verifiedUsersOnly}
            onChange={(e) => setVerifiedUsersOnly(e.target.checked)}
          />
          Show to verified users only
        </label>
        <label>Requirements</label>
        <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)}></textarea>
        <label>
          <input
            type="checkbox"
            checked={blurThumbnail}
            onChange={(e) => setBlurThumbnail(e.target.checked)}
          />
          Blur thumbnail
        </label>
        <button type="submit" disabled={uploading}>Post Ad</button>
        {uploading && <p>Uploading...</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default PostAd;
