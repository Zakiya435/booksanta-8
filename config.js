import firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyApQtn7WxRa7_VFIelEWBaPq2ucMl4jbTU",
  authDomain: "booksanta-af958.firebaseapp.com",
  databaseURL: "https://booksanta-af958.firebaseio.com",
  projectId: "booksanta-af958",
  storageBucket: "booksanta-af958.appspot.com",
  messagingSenderId: "544733455309",
  appId: "1:544733455309:web:738267d39301c599ce1a84"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
