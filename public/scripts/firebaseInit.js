const firebaseConfig = {
    apiKey: "AIzaSyCryJD58-EciGIk0x_vX08SUks2bIhMwcQ",
    authDomain: "comp426-quizapp.firebaseapp.com",
    databaseURL: "https://comp426-quizapp.firebaseio.com",
    projectId: "comp426-quizapp",
    storageBucket: "comp426-quizapp.appspot.com",
    messagingSenderId: "34156145827",
    appId: "1:34156145827:web:51539f011cca685af02316"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

db.settings({ timestampsInSnapshots: true });