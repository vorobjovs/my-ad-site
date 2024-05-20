// src/components/FirestoreTest.js

import React, { useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const FirestoreTest = () => {
  useEffect(() => {
    const testFirestoreConnection = async () => {
      try {
        const docRef = doc(db, 'users', 'testDoc'); // Change 'testDoc' to the document ID you created
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    testFirestoreConnection();
  }, []);

  return <div>Check console for Firestore test results.</div>;
};

export default FirestoreTest;
