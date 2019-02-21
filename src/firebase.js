import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyDoUDKQ89fAUn3GJZdeoI_LRmi332C0xCc',
  authDomain: 'react-slack-clone-d4dc2.firebaseapp.com',
  databaseURL: 'https://react-slack-clone-d4dc2.firebaseio.com',
  projectId: 'react-slack-clone-d4dc2',
  storageBucket: 'react-slack-clone-d4dc2.appspot.com',
  messagingSenderId: '819795682127'
};
firebase.initializeApp(config);

export default firebase;
