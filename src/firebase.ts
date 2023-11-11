import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAfNFYch40fZCyqUMnQPSI0buTNQHWgc34',
  authDomain: 'twitter-clone-ecfec.firebaseapp.com',
  projectId: 'twitter-clone-ecfec',
  storageBucket: 'twitter-clone-ecfec.appspot.com',
  messagingSenderId: '1045931875438',
  appId: '1:1045931875438:web:ad5df476db4346eab55a7f',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
