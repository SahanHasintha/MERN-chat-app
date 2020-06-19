import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAMtAmUT47-Lu9fKROwFLVW57HxNt1tSzk",
    authDomain: "chat-app-d922c.firebaseapp.com",
    databaseURL: "https://chat-app-d922c.firebaseio.com",
    projectId: "chat-app-d922c",
    storageBucket: "chat-app-d922c.appspot.com",
    messagingSenderId: "444768684963",
    appId: "1:444768684963:web:8cfdc702a9092afeda6816",
    measurementId: "G-VVJ1NTWKND"
}

firebase.initializeApp(config);

export default firebase;