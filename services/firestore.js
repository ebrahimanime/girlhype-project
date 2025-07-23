/*Where you’ll define reusable references and helper functions like usersRef, postsRef, etc.*/

// src/services/firestore.js
import { db } from '@/firebase/config';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';

// Collection references
export const usersRef = collection(db, 'users');
export const postsRef = collection(db, 'posts');
export const commentsRef = collection(db, 'comments');
export const likesRef = collection(db, 'likes');
export const followersRef = collection(db, 'followers');
export const notificationsRef = collection(db, 'notifications');

// Helper functions
export const getUserById = async (uid) => {
  const userDoc = await getDoc(doc(usersRef, uid));
  return userDoc.exists() ? userDoc.data() : null;
};

export const getUserPosts = async (uid) => {
  const q = query(postsRef, where('userId', '==', uid), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createPost = async (userId, content, imageUrl = null) => {
  return await addDoc(postsRef, {
    userId,
    content,
    imageUrl,
    createdAt: Timestamp.now()
  });
};

/* Add more as needed
This file gives you clean, centralized access to all your 
Firestore collections with readable query helpers.*/