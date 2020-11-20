import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { createManagementClient } from './util.js'

const PORT = process.env.PORT || 5000

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());

const managementClient = createManagementClient();

// NOTE(jake): set this to true to print out request bodies when they arrive
const DEBUG = true;

const post = (route, callback) => {
  return app.post(route, jsonParser, (req, res) => {
    if (DEBUG) {
      console.log('---------------------------------------------');
      console.log(`DEBUG: [route: ${route}]`);
      console.log("Request body:");
      console.log(req.body);
    }
    const result = callback(req, res);
    console.log('---------------------------------------------');
    return result;
  });
};

post('/api/login', (req, res) => {
  // TODO: implement login!!
});

post('/api/signup', (req, res) => {
  // TODO: implement signup!!
});

post('/api/search', (req, res) => {
  // TODO: implement search!!
  const dummy_results = [
    {name: "Alice", location: "Kingston", job: "Electrician"},
    {name: "Bob", location: "Providence", job: "Roofer"},
    {name: "Charlie", location: "Providence", job: "Construction Worker"}
  ]

  res.send(JSON.stringify({searchResults: dummy_results}));
});

post('/api/favorites', (req, res) => {
  // TODO: implement search!!
  const category = req.body.category;
  let dummy_results = [];
  if (category === "employee") {
    dummy_results = [
      {name: "Alice", location: "Kingston", job: "Electrician"},
      {name: "Bob", location: "Providence", job: "Roofer"},
      {name: "Charlie", location: "Providence", job: "Construction Worker"}
    ]
  } else if (category === "job") {
    dummy_results = [
      {name: "Company A", location: "Kingston", job: "Electrician"},
      {name: "Company B", location: "Providence", job: "Roofer"},
      {name: "Company C", location: "Providence", job: "Construction Worker"}
    ]
  } else if (category === "company") {
    dummy_results = [
      {name: "Company A", location: "Kingston"},
      {name: "Company B", location: "Providence"},
      {name: "Company C", location: "Providence"}
    ]
  }

  res.send(JSON.stringify({favorites: dummy_results}));
});

post('/api/account_type', (req, res) => {
  const userID = req.body.userID;
  let result = null;
  if (!userID) {
    res.send(JSON.stringify({accountType: null}));
    return;
  }
  managementClient.getUser({ id: userID }, function (err, user) {
    if (user) {
      res.send(JSON.stringify({accountType: user.user_metadata.accountType}));
    } else {
      res.send(JSON.stringify({accountType: null}));
    }
  });
});

// Serve fronted
app.use(express.static(path.join(__dirname, 'frontend/build')))

// 404 --> homepage
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'))
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log('---------------------------------------------');
});
