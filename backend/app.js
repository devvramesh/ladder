const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());

// NOTE(jake): set this to true to print out request bodies when they arrive
const DEBUG = true;

post = (route, callback) => {
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

  dummy_results = [
    {name: "Alice", location: "Kingston", job: "Electrician"},
    {name: "Bob", location: "Providence", job: "Roofer"},
    {name: "Charlie", location: "Providence", job: "Construction Worker"}
  ]

  res.send(JSON.stringify({searchResults: dummy_results}));
});

app.listen(3001, () => {
  console.log('Listening on port 3001');
  console.log('---------------------------------------------');
});
