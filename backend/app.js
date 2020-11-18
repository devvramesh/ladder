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
  res.send(JSON.stringify({data:'Hello World!'}));
});

app.listen(3001, () => {
  console.log('Listening on port 3001');
  console.log('---------------------------------------------');
});
