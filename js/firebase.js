

const firebaseConfig = {
  apiKey: "AIzaSyAIDLIxe5bPM-MZdBon39fcDUPZ9mPk1ag",
  authDomain: "tic-tac-toe-329b9.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-329b9.firebaseio.com",
  projectId: "tic-tac-toe-329b9",
  storageBucket: "tic-tac-toe-329b9.appspot.com",
  messagingSenderId: "24513296905",
  appId: "1:24513296905:web:c25c4648a07ec0569a56d8",
  measurementId: "G-FQH67FMW2K"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

database.ref('/').set({a:123});

