import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createManagementClient } from './util.js'

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

app.listen(3001, () => {
  console.log('Listening on port 3001');
  console.log('---------------------------------------------');
});
