const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
  console.log("welcome to the server")
});

app.get('/api/login', (req, res) => {
  console.log("in API call");
  res.send(JSON.stringify({data:'Hello World!'}));
  console.log("sent");
});

app.get('/api/signup', (req, res) => {
  // TODO: implement signup!!
});

app.get('/api/search', (req, res) => {
  // TODO: implement search!!
});

app.listen(3001, () =>
  console.log('Example app listening on port 3001!'),
);
