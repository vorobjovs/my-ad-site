// src/components/SimpleUpload.js

import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../contexts/AuthContext';

const SimpleUpload = () => {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      const storageRef = ref(storage, `testUploads/${currentUser.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optional: Handle upload progress if needed
        },
        (error) => {
          console.error('Error uploading file:', error);
          setUploading(false);
          setError('Error uploading file. Please try again later.');
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setFileUrl(downloadURL);
            setUploading(false);
            alert('File uploaded successfully!');
          } catch (error) {
            console.error('Error getting download URL:', error);
            setError('Error finalizing file upload. Please try again later.');
            setUploading(false);
          }
        }
      );
    } else {
      setError('Please select a file to upload.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpload();
  };

  return (
    <div className="simple-upload-container">
      <h2>Simple Upload</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        {fileUrl && <img src={fileUrl} alt="Uploaded File" className="uploaded-file" />}
        {uploading && <p>Uploading...</p>}
        <button type="submit" disabled={uploading}>Upload</button>
      </form>
    </div>
  );
};

export default SimpleUpload;
