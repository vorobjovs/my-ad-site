// src/pages/PostAd.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import './PostAd.css';

const PostAd = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoURLs, setPhotoURLs] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [verifiedUsersOnly, setVerifiedUsersOnly] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [blurThumbnail, setBlurThumbnail] = useState(false);
  const [tags, setTags] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPhotoURLs(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const uploadedPhotos = await Promise.all(
        photos.map(async (photo) => {
          const storageRef = ref(storage, `adPhotos/${currentUser.uid}/${photo.name}`);
          const uploadTask = uploadBytesResumable(storageRef, photo);

          await uploadTask;
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          return downloadURL;
        })
      );

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();

      await addDoc(collection(db, 'ads'), {
        title,
        description,
        price,
        category: customCategory ? customCategory : category,
        photos: uploadedPhotos,
        userId: currentUser.uid,
        userName: userData.name,
        userProfilePicture: userData.profilePictureUrl,
        verifiedUsersOnly,
        requirements,
        blurThumbnail,
        tags,
        thumbnailIndex,
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

  const handleCategoryClick = (category) => {
    setCategory(category);
  };

  const handleRequirementClick = (requirement) => {
    setRequirements((prev) =>
      prev.includes(requirement)
        ? prev.filter((req) => req !== requirement)
        : [...prev, requirement]
    );
  };

  const handleTagClick = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleRemoveImage = (index) => {
    const newPhotos = [...photos];
    const newPhotoURLs = [...photoURLs];
    newPhotos.splice(index, 1);
    newPhotoURLs.splice(index, 1);
    setPhotos(newPhotos);
    setPhotoURLs(newPhotoURLs);
    if (thumbnailIndex >= newPhotos.length) {
      setThumbnailIndex(newPhotos.length - 1);
    }
  };

  const handlePrevImage = () => {
    setThumbnailIndex((prevIndex) =>
      prevIndex === 0 ? photoURLs.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setThumbnailIndex((prevIndex) =>
      prevIndex === photoURLs.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="post-ad-container">
      <h1>Post an Ad</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="title"
            maxLength="120"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ad title"
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <div className="category-buttons">
            {['Fashion', 'Cars', 'Woodworking', 'Gaming', 'Pets'].map((cat) => (
              <button
                type="button"
                key={cat}
                className={`category-button ${category === cat ? 'selected' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="custom-category-input"
          />
        </div>
        
        <label>Attach Photos or Media</label>
        <div className="image-carousel">
          <button type="button" className="image-nav" onClick={handlePrevImage}>
            &lt;
          </button>
          <input type="file" multiple onChange={handlePhotoChange} />
          <div className="photo-preview">
            {photoURLs.length > 0 ? (
              photoURLs.map((url, index) => (
                <div key={index} className="thumbnail-container">
                  <img src={url} alt={`Preview ${index}`} className="thumbnail" />
                  <button type="button" className="remove-button" onClick={() => handleRemoveImage(index)}>
                    &times;
                  </button>
                  <input
                    type="radio"
                    name="thumbnail"
                    checked={thumbnailIndex === index}
                    onChange={() => setThumbnailIndex(index)}
                  />
                </div>
              ))
            ) : (
              <div className="placeholder">Upload Photo</div>
            )}
          </div>
          <button type="button" className="image-nav" onClick={handleNextImage}>
            &gt;
          </button>
        </div>
        <label>
          <input
            type="checkbox"
            checked={blurThumbnail}
            onChange={(e) => setBlurThumbnail(e.target.checked)}
          />
          Blur thumbnail
        </label>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="form-input"
          />
        </div>
        
        <label>Tags</label>
        <div className="tag-buttons">
          {['Creator', 'Advertiser', 'Product', 'Service'].map((tag) => (
            <button
              type="button"
              key={tag}
              className={`tag-button ${tags.includes(tag) ? 'selected' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-input"
          ></textarea>
        </div>
        
        <label>Verification Requirements</label>
        <div className="requirement-buttons">
          {[
            'No requirements',
            'Min follower count',
            'Max follower count',
            'Location',
            'Verified Twitter',
            'Verified YouTube',
            'Verified Instagram',
            'Verified Pinterest',
          ].map((req) => (
            <button
              type="button"
              key={req}
              className={`requirement-button ${requirements.includes(req) ? 'selected' : ''}`}
              onClick={() => handleRequirementClick(req)}
            >
              {req}
            </button>
          ))}
        </div>
        
        <button type="submit" disabled={uploading}>
          Post Ad
        </button>
        {uploading && <p>Uploading...</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default PostAd;
