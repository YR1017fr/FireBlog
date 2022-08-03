import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDNJbN323SyNJ0e5z99gdw8e5tGQaT6egg",
    authDomain: "fireblogs-bb0a0.firebaseapp.com",
    projectId: "fireblogs-bb0a0",
    storageBucket: "fireblogs-bb0a0.appspot.com",
    messagingSenderId: "709271239706",
    appId: "1:709271239706:web:c79df170c1b640a3eaa5a3"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export {timestamp}
export default firebaseApp.firestore()