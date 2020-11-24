import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { createManagementClient } from './util.js'
import { dbInit, withDB, logDBInfo, Employee } from './db.js'

const PORT = process.env.PORT || 5000
const DEBUG = true;

const app = express();
const jsonParser = bodyParser.json();
app.use(cors());
const managementClient = createManagementClient();

function serveApp() {
  console.log('Serving backend...')

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

  post('/api/user_info', (req, res) => {
    const userID = req.body.userID;
    let result = null;
    if (!userID) {
      res.send(JSON.stringify({accountType: null}));
      return;
    }
    managementClient.getUser({ id: userID }, function (err, user) {
      if (user) {
        res.send(JSON.stringify({
          username: user.username,
          accountType: user.user_metadata.accountType
        }));
      } else {
        res.send(JSON.stringify({accountType: null}));
      }
    });
  });

  post('/api/login_successful', (req, res) => {
    const userID = req.body.userID;
    let result = null;
    if (!userID) {
      res.send(JSON.stringify({}));
      return;
    }
    managementClient.getUser({ id: userID }, function (err, user) {
      if (user) {
        if (user.user_metadata.accountType === "employee") {
          // TODO: insert employee into DB
        } else if (user.user_metadata.accountType === "employer") {
          // TODO: insert employer into DB
        } else {
          res.send(JSON.stringify({}));
        }
      } else {
        res.send(JSON.stringify({}));
      }
    });
  });

  console.log('Backend served.')

  if (process.env.RUN_MODE === "HEROKU") {
    console.log("Running on Heroku. Frontend should have been built already.")
    console.log("Serving frontend...")

    // Serve frontend
    app.use(express.static('/app/frontend/build'))

    // Necessary for paths with query string
    app.get('*', (req, res) => {
      res.sendFile('/app/frontend/build/index.html')
    })

    console.log('Frontend served.')
  } else {
    console.log("Running locally. Start frontend with [cd frontend; npm start]")
  }

  app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
    console.log('---------------------------------------------');
  });
}

async function main() {
  console.log("Initializing DB...")
  await dbInit();
  await logDBInfo();
  console.log("Done initializing DB.")
  serveApp();
}

main()
