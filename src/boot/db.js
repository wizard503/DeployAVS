import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import 'firebase/compat/auth'

import { addDoc, collection, getDocs } from 'firebase/firestore'

import { getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider, signOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAGhv1dZm3tWdYTMusyR5KkU0nmKviJ8CE',
  authDomain: 'atrasvasoloapp.firebaseapp.com',
  projectId: 'atrasvasoloapp',
  storageBucket: 'atrasvasoloapp.appspot.com',
  messagingSenderId: '1065922454951',
  appId: '1:1065922454951:web:0051c0006a696e8d0e8282',
  measurementId: 'G-HTDCLYJPP7'
}

const app = firebase.initializeApp(firebaseConfig)

export const db = app.firestore()
export const storage = app.storage()

export { addDoc, collection, getDocs, getAuth, signInWithPopup, onAuthStateChanged, GoogleAuthProvider, signOut }

const { Timestamp, GeoPoint } = firebase.firestore
export { Timestamp, GeoPoint }

db.settings({ timestampsInSnapshots: true })
