const firebaseConfig = {
  apiKey: "AIzaSyBEhUQUVQtfMhN0kHKJXmSXhjUiqjxMVOM",
  authDomain: "mind-musings-journal.firebaseapp.com",
  projectId: "mind-musings-journal",
  storageBucket: "mind-musings-journal.appspot.com",
  messagingSenderId: "1014039755507",
  appId: "1:1014039755507:web:786e06f449959976dd9586"
};

firebase.initializeApp(firebaseConfig);

// ✅ Make these globally accessible
window.db = firebase.firestore();
window.storage = firebase.storage();
