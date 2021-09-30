import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBgVbCou55F4CwHKIhPbJKp0z1TYIdKfFQ",
  authDomain: "rn-uber-eats-clone-kl.firebaseapp.com",
  projectId: "rn-uber-eats-clone-kl",
  storageBucket: "rn-uber-eats-clone-kl.appspot.com",
  messagingSenderId: "1036324854718",
  appId: "1:1036324854718:web:fad66655982eb25a2ff7ef",
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export default firebase;
