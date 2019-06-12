const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();


// Create a new item in the museum: takes a title and a path to an image.
var db = firebase.firestore();
var itemsRef = db.collection('items');

app.post('/api/items', async (req, res) => {
    try {
        console.log(req.body)
        let querySnapshot = await itemsRef.get();
        let numRecords = querySnapshot.docs.length;
        let item = {
            id: numRecords + 1,
            title: req.body.title,
            path: req.body.path,
            description: req.body.description,
        };
        itemsRef.doc(item.id.toString()).set(item);
        res.send(item);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

// Deletes an item in the museum, and lowers all other id's after the deleted by 1
app.delete('/api/items/:id', async (req, res) => {
    console.log('id: ', req.params.id);
    try{
        let querySnapshot = await itemsRef.get();
        console.log("got database",)
        let numRecords = querySnapshot.docs.length;
        let findId = req.params.id;
        itemsRef.doc(findId.toString()).delete();
        console.log(querySnapshot.docs.map(doc => doc.data()));
        if (findId != numRecords) {
            for (var i = findId; i < (numRecords); i++) {
                let toChange = i + 1;
                itemsRef.doc(toChange.toString()).update({
                    id: i,
                });
            }
        }
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

app.put('/api/items/:id', async (req, res) => {
    console.log('id: ', req.params.id);
    try{
        let newTitle = req.body.title;
        let newDesc = req.body.description;
        console.log(req.body.title);
        let findID = req.params.id;
        itemsRef.doc(findID.toString()).update({
            title: newTitle,
            description: newDesc,
        })
        let querySnapshot = await itemsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
    try{
        let querySnapshot = await itemsRef.get();
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
