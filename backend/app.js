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
import Job from './db/job.js'
import Favorites from './db/favorites.js'

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
    const category = req.body.category;
    const query = req.body.query || "";

    if (!category) {
      sendBlank(res);
      return;
    }

    withDB(async (client) => {
      if (category === "employee") {
        const result = await Employee.searchInDB(client, query)
        res.send(JSON.stringify(result))
        return;
      } else if (category === "job") {
        const result = await Job.searchInDB(client, query)
        res.send(JSON.stringify(result))
        return;
      } else {
        sendBlank(res);
        return;
      }
    })
  });

  post('/api/job_info', (req, res) => {
    let jobID = req.body.job_id
    if (!jobID) {
      sendBlank(res);
      return;
    }

    withDB(async (client) => {
      const result = await Job.findInDB(client, jobID)
      res.send(JSON.stringify(result))
      return;
    })
  })

  post('/api/get_jobs', (req, res) => {
    let userID = req.body.userID
    const published = req.body.published || false
    if (!userID) {
      sendBlank(res);
      return;
    }

    withDB(async (client) => {
      const result = await Job.findByEmployerInDB(client, userID, published)
      res.send(JSON.stringify(result))
      return;
    })
  })

  post('/api/update_job', (req, res) => {
    let jobID = req.body.job_id
    if (!jobID) {
      sendBlank(res);
      return;
    }

    const job = new Job(
      jobID,
      req.body.employer_auth0_user_id,
      req.body.job_title,
      req.body.description,
      req.body.qualifications,
      req.body.logistics,
      req.body.job_image_url,
      req.body.published
    )

    withDB(async (client) => {
      if (jobID === -1) {
        // create new job
        const newJobID = await job.createInDB(client)
        res.send(JSON.stringify({job_id : newJobID}))
        return
      } else {
        // update existing job
        await job.updateInDB(client)
        sendBlank(res);
        return;
      }
    })
  })

  post ('/api/delete_job', (req, res) => {
    let jobID = req.body.job_id
    if (!jobID) {
      sendBlank(res);
      return;
    }

    withDB(async (client) => {
      const result = await Job.deleteFromDB(client, jobID)
      sendBlank(res)
      return;
    })
  })

  post('/api/update_favorite', (req, res) => {
    const userID = req.body.userID;
    const category = req.body.category;
    const favoritee_id = req.body.favoritee_id;
    const favorite_status = req.body.favorite_status || false;

    if (!userID || !category || !favoritee_id) {
      sendBlank(res);
      return;
    }

    withDB(async (client) => {
      let result = [];
      if (category === "employee") {
        result = await Favorites.updateFavoriteEmployee(client, userID, favoritee_id, favorite_status)
      } else if (category === "job") {
        result = await Favorites.updateFavoriteJob(client, userID, favoritee_id, favorite_status)
      } else if (category === "company") {
        result = await Favorites.updateFavoriteEmployer(client, userID, favoritee_id, favorite_status)
      }

      sendBlank(res);
      return;
    })
  })

  post ('/api/is_favorite', (req, res) => {
    const userID = req.body.userID;
    const category = req.body.category;
    const favoritee_id = req.body.favoritee_id;

    if (!userID || !category || !favoritee_id) {
      sendBlank(res);
      return;
    }

    withDB(async (client) => {
      if (category === "employee") {
        const result = await Favorites.isFavoriteEmployee(client, userID, favoritee_id)
        res.send(JSON.stringify({is_favorite: result}))
      } else if (category === "job") {
        const result = await Favorites.isFavoriteJob(client, userID, favoritee_id)
        res.send(JSON.stringify({is_favorite: result}))
      } else if (category === "company") {
        const result = await Favorites.isFavoriteEmployer(client, userID, favoritee_id)
        res.send(JSON.stringify({is_favorite: result}))
      } else {
        sendBlank(res);
        return;
      }
    })
  })

  post('/api/favorites', (req, res) => {
    const userID = req.body.userID;
    const category = req.body.category;
    if (!userID || !category) {
      sendBlank(res);
      return;
    }

    withDB(async (client) => {
      let result = [];
      if (category === "employee") {
        result = await Favorites.getFavoriteEmployees(client, userID)
      } else if (category === "job") {
        result = await Favorites.getFavoriteJobs(client, userID)
      } else if (category === "company") {
        result = await Favorites.getFavoriteEmployers(client, userID)
      } else {
        sendBlank(res);
        return;
      }

      res.send(JSON.stringify(result));
    })
  });

  post('/api/update_profile', (req, res) => {
    const userID = req.body.userID;

    if (!userID) {
      sendBlank(res);
      return;
    }

    withDB(async (client) => {
      const user = await User.findByID(client, userID)
      if (!user) {
        sendBlank(res);
        return;
      }
      const account_type = user.account_type;

      if (account_type === "employee") {
        await new Employee(
          req.body.userID,
          req.body.username,
          req.body.name,
          req.body.email,
          req.body.phone,
          req.body.location,
          req.body.profile_img_url,
          req.body.category,
          req.body.qualifications,
          req.body.about,
          req.body.looking_for
        ).updateInDB(client)
        sendBlank(res);
        return;
      } else if (account_type === "employer") {
        await new Employer(
          req.body.userID,
          req.body.username,
          req.body.name,
          req.body.email,
          req.body.phone,
          req.body.location,
          req.body.profile_img_url,
          req.body.about,
          req.body.logistics
        ).updateInDB(client)
        sendBlank(res);
        return;
      } else {
        sendBlank(res);
        return;
      }
    })
  })

  post('/api/user_info', (req, res) => {
    let userID = req.body.userID;
    let username = req.body.username;

    if (!userID && !username) {
      sendBlank(res);
      return;
    }

    withDB(async (client) => {
      let account_type = null;
      {
        let user;
        if (userID) {
          user = await User.findByID(client, userID)
        } else {
          user = await User.findByUsername(client, username)
        }

        console.log('send 0')
        console.log(user)

        if (user) {
          userID = user.auth0_user_id
          username = user.username
          account_type = user.account_type
        }
      }

      if (account_type) {
        // user exists in DB. find and return
        let result;
        if (account_type === "employee") {
          result = await Employee.findInDB(client, userID)
        } else if (account_type === "employer") {
          result = await Employer.findInDB(client, userID)
        } else {
          sendBlank(res);
          return;
        }
        console.log('send 1')
        console.log(result)
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
        const name = user_auth0.user_metadata.name
        account_type = user_auth0.user_metadata.account_type
        const email = user_auth0.email

        let result;
        if (account_type === "employee") {
          await new Employee(userID, username, name, email).updateInDB(client)
          result = await Employee.findInDB(client, userID)
        } else if (account_type === "employer") {
          await new Employer(userID, username, name, email).updateInDB(client)
          result = await Employer.findInDB(client, userID)
        } else {
          sendBlank(res);
          return;
        }
        console.log('send 2')
        console.log(result)
        res.send(JSON.stringify(result))
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
