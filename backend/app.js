const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());

post = (route, fn) => app.post(route, jsonParser, fn)

post('/api/login', (req, res) => {
  console.log("in API call");
  res.send(JSON.stringify({data:'Hello World!'}));
  console.log("sent");
});

post('/api/signup', (req, res) => {
  // TODO: implement signup!!
});

post('/api/search', (req, res) => {
  // TODO: implement search!!
  res.send(JSON.stringify({data:'Hello World!'}));
});

app.listen(3001, () =>
  console.log('Listening on port 3001\n-------------------'),
);
