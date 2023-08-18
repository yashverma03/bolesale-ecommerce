import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import dotenv from 'dotenv';

// dotenv.config();

const firebaseConfig = {
  apiKey: 'AIzaSyBSAzJIO2PRBHeFIOlrQmTaWi7jChqaoFY',
  authDomain: 'bolesale-ecommerce.firebaseapp.com',
  projectId: 'bolesale-ecommerce',
  storageBucket: 'bolesale-ecommerce.appspot.com',
  messagingSenderId: '16110613986',
  appId: '1:16110613986:web:3907df4d293c19defa35bb',
  measurementId: 'G-1BPT2JRW84'
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const fs = getFirestore(app);
const storage = getStorage(app);

export { auth, fs, storage };
