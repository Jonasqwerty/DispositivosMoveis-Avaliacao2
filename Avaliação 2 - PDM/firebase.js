// Import the functions you need from the SDKs you need
//import * as firebase from "firebase
//import * as firebase from "firebase/app";
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// cada produto do firebase deve ser importad separadamente
//por exemplo auth de autenticação
import "firebase/compat/auth";

import "firebase/compat/firestore";
import "firebase/compat/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDbqX2DE_ye8UsF2m-91acHMFMSQ1Ldoc",    

  authDomain: "trabalhopdm2-faa53.firebaseapp.com",    

  projectId: "trabalhopdm2-faa53",    

  storageBucket: "trabalhopdm2-faa53.appspot.com",    

  messagingSenderId: "29051996531",    

  appId: "1:29051996531:web:1f550f2d3f92a13b7f1d06" 
  

};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()
const firestore = firebase.firestore()
const storage = firebase.storage()

export { auth, firestore, storage };