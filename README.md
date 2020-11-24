# COMP 426 Final Project
The final project for COMP 426 - Modern Web Programming

## Quizzical
This web application will allow users to create an account, answer trivia, and monitor the score of themselves and others over time.

### Live URL
The live version of our side can currently be found here: [Quizzical](https://comp426-quizapp.web.app/)

## Development
For the current development to-do list, head to the projects page of the github.
To run the development server locally just type:
```bash
npm run start
```

## API Documentation
The API we chose for this project is [Open Trivia DB](https://opentdb.com/). This API fetches random trivia questions with three incorrect answers and one correct answer, so that you can construct a multiple choice question.

### Usage
The first call you must make to use this API is to fetch a token for use as a parameter of the remainder of your calls. This can be done as follows.
```javascript
const token = await axios({
    method: 'get',
    url: 'https://opentdb.com/api_token.php?command=request',
});
```
The other request we made to this API was to fetch N random questions from the server; in our case we were requesting a batch size of 10 questions. We did this as follows.
```javascript
const questions = await axios({
    method: 'get',
    url: 'https://opentdb.com/api.php?amount=10',
    params: {
        token: token,
        type: "multiple",
    },
});
```
This request returns an array of question objects as its data. The fields we used from these objects are:
- question (string)
    - The trivia question
- correct_answer (string)
    - The correct answer to the question
- incorrect_answers (array[string])
    - An array of feasible incorrect answers
- difficulty (string)
    - Either "easy", "medium", or "hard" denoting the specificity of the question

## Backend Documentation
This project uses firebase to manage backend resources. We are using the hosting, authentication, and firebase storage features.

### Setup
To begin using Firebase you must create a project through the online [Firebase Console](https://console.firebase.google.com/). The next step is to install the Firebase CLI tools with:
```bash
npm install -g firebase-tools
```
After installing this package you log in to the Firebase CLI using your Google account with:
```bash
firebase login
```

Once logged in you can run the following command to connect the project on your computer to the one you made on the Firebase Console.
```bash
firebase init
```

To setup Firebase on your web app you need a few lines of code. The first to construct an object like so:
```javascript
const firebaseConfig = {
    apiKey: "API_key",
    authDomain: "domain",
    databaseURL: "db_url",
    projectId: "pid",
    storageBucket: "storage_url",
    messagingSenderId: "msid",
    appId: "aid"
};
```
This example object was made with filler values as the real object is individual to the project. The config object for your project can be found on the Firebase Console.

With this config object you can initialize Firebase to work for your web app and prepare the services you need.
```javascript
firebase.initializeApp( firebaseConfig );

const auth = firebase.auth();
const db = firebase.firestore();
```

I am running the last two lines to configure the two services I will be using from the website: Firebase Authentication and Firebase Firestore.

### Firebase Hosting

Firebase Hosting is fairly self-explanatory. Once logged in with the CLI you simply need two commands for development and production deployment.
```bash
firebase serve
firebase deploy
```

The first command is used to deploy your app locally for testing with the full power of firebase. This is especially useful if you use the Firebase Cloud Functions service. The second command is used to deploy the version of the site on your computer to production and therefore make it live on the web.

### Firebase Authentication

The Firebase Authentication services can be accessed using the "auth" variable defined in the setup section. Though it is simple to implement many methods of login with Firebase we decided to use email and password login, as it is the classic method.

We used three Firebase Authentication functions to construct our login and signup process.
```javascript
auth.createUserWithEmailAndPassword( email, password );

auth.signInWithEmailAndPassword( email, password );

auth.onAuthStateChanged( callbackFunction );
```
The first of these creates a user and takes in the email and password they provide. It will throw an error if the email is already in use or if the password is less than six characters. If it is successful, it will log the new user in, return an object representing the logged in user, and provide them with a cookie for re-authentication across pages.

The second function signs a user in with the email and password provided. It will throw an error if the account email does not exist or if the given password does not match the registered email. If successful, it will follow the same steps as create new user.

The third function is an event handler that will monitor the user state. The callback function will first be called when any page is loaded to check that the user is logged in and it will also be called any time a user logs in or out. When called it will provide a user object if there is a logged in user and a null value if there is no logged in user.

### Firebase Firestore

Firestore is a document based, no-sql storage system that comes as one of the Firebase services. The largest element of this system is a collection which should contain documents representing a similar concept. These documents are stored as JSON objects, labeled with a key (that can be provided or auto-generated), and can hold many data types.

We used one collection, labeled "users", to store our data for this project. This collection contains documents with a key provided by Firebase Authentication labeled "uid". The documents are structured as follows:
```
{
    correct (number): The number of questions answered correctly by the user,
    incorrect (number): The number of questions answered incorrectly by the user,
    rating (number): The ELO rating of the user,
    username (string): The username provided when the account was created,
}
```

The Firebase Firestore services can be accessed using the "db" variable defined in the setup section. This system clearly supports all CRUD opperations, each of which is explained below. To create a new document you can call:
```javascript
await db.collection( collection_label ).doc( document_key ).set( JSON_object );
```
Where "collection_label" is the name of the collection (in our case "users"), "document_key" is the key for the document you will be creating, and "JSON_object" is the object that will be stored in that document.

To read a document you can call:
```javascript
const result = await db.collection( collection_label ).doc( document_key ).get();
const data = result.data();
```
Where the variables represent the same things as in the last example. The data variable will contain the JSON object stored by Firestore under the given collection and document key.

To update a document you can call:
```javascript
await db.collection( collection_label ).doc( document_key ).update( JSON_object );
```
Where first two variables are the same as in the preceding examples. The JSON_object must only contain the key value pairs for the fields you are trying to update the values of.

To delete a document you can call:
```javascript
await db.collection( collection_label ).doc( document_key ).delete();
```
Where first two variables are the same as in the preceding examples. This will delete the object and all of the fields contained within it.

## Rating System
The rating value stored for this project is derived from the ELO rating system, as used by the chess community. All accounts are initialized with a rating of 1000 and they "compete" against the questions they answer. The questions are rated by their respective difficulty. Questions labeled "easy" have a rating of 800, "medium" have a rating of 1200, and "hard" have a rating of 1600. This was implemented for ease and accuracy of user rating and ensures that if someone is given more easy or hard questions they will not boost/diminish their leaderboard rank by a larger amount than is warranted.

## License
[ISC](https://choosealicense.com/licenses/isc/)