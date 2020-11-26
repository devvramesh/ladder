import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import { createManagementClient } from './util.js'
import { dbInit, withDB, logDBInfo } from './db/db.js'
import User from './db/user.js'
import Employee from './db/employee.js'
import Employer from './db/employer.js'

const PORT = process.env.PORT || 5000
const DEBUG = true;

const app = express();
const jsonParser = bodyParser.json();
app.use(cors());
const managementClient = createManagementClient();

function sendBlank(res) {
  res.send(JSON.stringify({}))
}

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
    withDB(async (client) => {
      let userID = req.body.userID;
      let username = req.body.username;
      let accountType = null;

      if (!userID && !username) {
        sendBlank(res);
        return;
      }

      {
        let user;
        if (userID) {
          user = await User.findByID(client, userID)
        } else {
          user = await User.findByUsername(client, username)
        }

        console.log(user)

        if (user) {
          userID = user.auth0_user_id
          username = user.username
          accountType = user.type
        }
      }

      console.log(userID)
      console.log(username)
      console.log(accountType)

      if (accountType) {
        // user exists in DB. find and return
        let result;
        if (accountType === "employee") {
          result = await Employee.findInDB(client, userID)
        } else if (accountType === "employer") {
          result = await Employer.findInDB(client, userID)
        } else {
          sendBlank(res);
          return;
        }
        // TODO: return specifics
        result.accountType = accountType
        console.log('send 1')
        res.send(JSON.stringify(result))
        return;
      } else {
        // user does not exist yet in DB. insert user and return
        if (!userID) {
          sendBlank(res)
          return;
        }

        const user_auth0 = await managementClient.getUser({ id: userID })
        if (!user_auth0) {
          sendBlank(res);
          return;
        }
        userID = user_auth0.user_id
        username = user_auth0.username
        accountType = user_auth0.user_metadata.accountType

        if (accountType === "employee") {
          await new Employee(
            userID, username, user_auth0.name, user_auth0.email
          ).createInDB(client)
        } else if (accountType === "employer") {
          await new Employer(
            userID, username, user_auth0.name, user_auth0.email
          ).createInDB(client)
        } else {
          sendBlank(res);
          return;
        }
        // TODO: return specifics
        console.log('send 2')
        res.send(JSON.stringify({
          userID: userID,
          accountType: accountType,
          username: username
        }))
        return;
      }
    })
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
