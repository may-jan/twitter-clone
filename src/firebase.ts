import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBQeG6qZTj1bt1QGesp5IxxOU_paII1PI0',
  authDomain: 'twitter-clone-e6138.firebaseapp.com',
  projectId: 'twitter-clone-e6138',
  storageBucket: 'twitter-clone-e6138.firebasestorage.app',
  messagingSenderId: '304421986476',
  appId: '1:304421986476:web:e8c04d306973ef058d3f09',
  measurementId: 'G-WMGQTZ6N7M',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
