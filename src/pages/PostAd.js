import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import './PostAd.css';
import { CaretLeftFilled, CaretRightFilled } from '@ant-design/icons';

const categoriesList = ['Fashion', 'Cars', 'Woodworking', 'Gaming', 'Pets'];
const tagsList = ['Creator', 'Advertiser', 'Product', 'Service'];
const requirementsList = ['No requirements', 'Min follower count', 'Max follower count', 'Location', 'Verified Twitter', 'Verified YouTube', 'Verified Instagram', 'Verified Pinterest'];

const PostAd = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState([]);
  const [customCategory, setCustomCategory] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoURLs, setPhotoURLs] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [verifiedUsersOnly, setVerifiedUsersOnly] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [blurThumbnail, setBlurThumbnail] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPhotoURLs(urls);
  };

  const handleCategoryChange = (category) => {
    setCategory((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter((cat) => cat !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };

  const handleRequirementsChange = (requirement) => {
    setRequirements((prevRequirements) => {
      if (prevRequirements.includes(requirement)) {
        return prevRequirements.filter((req) => req !== requirement);
      } else {
        return [...prevRequirements, requirement];
      }
    });
  };

  const handleRemovePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoURLs(photoURLs.filter((_, i) => i !== index));
    if (index === thumbnailIndex && photos.length > 1) {
      setThumbnailIndex(0);
    } else if (index < thumbnailIndex) {
      setThumbnailIndex(thumbnailIndex - 1);
    }
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
        category: [...category, customCategory],
        photos: uploadedPhotos,
        thumbnail: uploadedPhotos[thumbnailIndex],
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
        <label>Category</label>
        <div className="category-buttons">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-button ${category.includes(cat) ? 'selected' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <input type="text" placeholder="Custom category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
        <label>Attach Photos or Media</label>
        <div className="photo-preview">
  <button type="button" className="carousel-button prev" onClick={() => setThumbnailIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}><CaretLeftFilled /></button>
  {photoURLs.map((url, index) => (
    <div key={index} className="photo-thumbnail">
      <img src={url} alt={`Preview ${index}`} className={blurThumbnail && thumbnailIndex === index ? 'blur' : ''} />
      <button type="button" className="remove-photo" onClick={() => handleRemovePhoto(index)}>x</button>
      <label>
        <input
          type="radio"
          name="thumbnail"
          checked={thumbnailIndex === index}
          onChange={() => setThumbnailIndex(index)}
        />
        Thumbnail
      </label>
    </div>
  ))}
  {photoURLs.length < 3 && (
    <div className="photo-thumbnail empty">
      <input type="file" multiple onChange={handlePhotoChange} />
      <span>Upload Photo</span>
    </div>
  )}
  <button type="button" className="carousel-button next" onClick={() => setThumbnailIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}><CaretRightFilled /></button>
  </div>
        <label>
          <input type="checkbox" checked={blurThumbnail} onChange={(e) => setBlurThumbnail(e.target.checked)} />
          Blur thumbnail
        </label>
        <label>Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <label>Tags</label>
        <div className="category-buttons">
          {tagsList.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`category-button ${category.includes(tag) ? 'selected' : ''}`}
              onClick={() => handleCategoryChange(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        <label>Verification Requirements</label>
        <div className="category-buttons">
          {requirementsList.map((req) => (
            <button
              key={req}
              type="button"
              className={`category-button ${requirements.includes(req) ? 'selected' : ''}`}
              onClick={() => handleRequirementsChange(req)}
            >
              {req}
            </button>
          ))}
        </div>
        <button type="submit" disabled={uploading}>Post Ad</button>
        {uploading && <p>Uploading...</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default PostAd;
