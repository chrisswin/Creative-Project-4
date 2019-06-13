const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();


// Create a new item in the museum: takes a title and a path to an image.
var db = firebase.firestore();
var postsRef = db.collection('Posts');


// Add a post
app.post('/api/posts', async (req, res) => {
    try {
        console.log(req.body)
        let querySnapshot = await postsRef.get();
        let numRecords = querySnapshot.docs.length;
        let item = {
            id: numRecords + 1,
            title: req.body.title,
            user: req.body.user,
            text: req.body.text,
        };
        postsRef.doc(item.id.toString()).set(item);
        res.send(item);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

// Delete a Post
app.delete('/api/items/:id', async (req, res) => {
    console.log('id: ', req.params.id);
    try{
        console.log("got database",);
        let findId = req.params.id;
        postsRef.doc(findId.toString()).delete();
        let querySnapshot = await postsRef.get();
        console.log(querySnapshot.docs.map(doc => doc.data()));
        let numRecords = querySnapshot.docs.length;

        if (findId < numRecords) {
            for (var i = findId; i < (numRecords); i++) {

                let toChange = i + 1;
                postsRef.doc(i.toString()).update({
                    id: i,
                    title: querySnapshot.docs[toChange].title,
                    text: querySnapshot.docs[toChange].text,
                    user : querySnapshot.docs[toChange].user,
                });
            }
        }
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

//Edit Posts
app.put('/api/items/:id', async (req, res) => {
    console.log('id: ', req.params.id);
    try{
        let newTitle = req.body.title;
        let newText = req.body.text;
        let newUser = req.body.user;
        console.log(req.body.title);
        let findId = req.params.id;
        postsRef.doc(findId.toString()).update({
            title: newTitle,
            text: newText,
            user: newUser,
        })
        let querySnapshot = await postsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
        console.log(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

// Get where user
app.get('/api/items/user/:user', async (req, res) => {
    try{
        let findUser = req.params.user;
        console.log("User:", req.params.user);
        let querySnapshot = await postsRef.where("user", "==", findUser).get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        res.sendStatus(500);
    }
});

// Get where title
app.get('/api/items/title/:title', async (req, res) => {
    try{
        let findTitle = req.params.title;
        console.log("Title:", req.params.title);
        let querySnapshot = await postsRef.where("title", "==", findTitle).get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        res.sendStatus(500);
    }
});

// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
    try{
        let querySnapshot = await postsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        res.sendStatus(500);
    }
});

exports.app = functions.https.onRequest(app);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
