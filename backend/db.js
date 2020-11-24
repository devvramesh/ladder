import dotenv from 'dotenv';
dotenv.config()

import * as pg from 'pg'
const { Client, Pool } = pg.default;

import fixedWidthString from 'fixed-width-string';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})


let initialized = false;

// NOTE(jake): delete eventually. just resets the DB each run
// and fills it with dummy data.
let TESTING = true;

export async function withDB(fn) {
  const client = await pool.connect()
  let result = null;
  try {
    await client.query('BEGIN')
    result = await fn(client)
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
  return result;
}

export async function dbInit() {
  await withDB(async (client) => {
    await client.query(
      `CREATE TABLE IF NOT EXISTS users(
        auth0_user_id TEXT NOT NULL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL CHECK(type = 'employee' OR type = 'employer'),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT UNIQUE,
        location TEXT,
        profile_img_url TEXT
      )`
    )

    await client.query(
      `CREATE TABLE IF NOT EXISTS employees(
        auth0_user_id TEXT NOT NULL PRIMARY KEY,
        qualifications TEXT,
        about TEXT,
        looking_for TEXT,

        FOREIGN KEY (auth0_user_id) REFERENCES users(auth0_user_id)
      )`
    )

    await client.query(
      `CREATE TABLE IF NOT EXISTS employers(
        auth0_user_id TEXT NOT NULL PRIMARY KEY,
        about TEXT,
        logistics TEXT,

        FOREIGN KEY (auth0_user_id) REFERENCES users(auth0_user_id)
      )`
    )

    await client.query(
      `CREATE TABLE IF NOT EXISTS jobs(
        post_id SERIAL NOT NULL PRIMARY KEY,
        employer_auth0_user_id TEXT NOT NULL UNIQUE,
        job_title TEXT NOT NULL,
        description TEXT,
        qualifications TEXT,
        logistics TEXT,
        job_image_url TEXT,

        FOREIGN KEY (employer_auth0_user_id) REFERENCES employers(auth0_user_id)
      )`
    )
  })
}

export async function logDBInfo() {
  await withDB(async (client) => {
    const schema = await client.query(`
      SELECT table_name, string_agg(column_name, ', ' ORDER BY column_name) AS columns
      FROM
        information_schema.tables AS t
        NATURAL JOIN information_schema.columns AS c
      WHERE table_schema = 'public'
      GROUP BY table_name
      ORDER BY table_name;
    `)

    console.log("----------------------------------------------------------------------------------------------------")
    console.log("DB SCHEMA:")
    console.log("----------------------------------------------------------------------------------------------------")
    schema.rows.forEach((row) => {
      console.log(`${fixedWidthString(row.table_name, 9)} | ${row.columns}`)
    })
    console.log("----------------------------------------------------------------------------------------------------")
  })
}


//   console.log('initializing DB')
//   db.serialize(() => {
//     db.run(
//       `CREATE TABLE IF NOT EXISTS users(
//         id TEXT NOT NULL PRIMARY KEY,
//         type TEXT NOT NULL CHECK(type = 'employee' OR type =='employer'),
//         name TEXT NOT NULL,
//         email TEXT NOT NULL UNIQUE,
//         phone TEXT UNIQUE,
//         location TEXT,
//         profile_img BLOB
//       )`
//     )
//
//     // db.run(
//     //   `CREATE TABLE IF NOT EXISTS employees(
//     //     id TEXT NOT NULL PRIMARY KEY,
//     //     qualifications TEXT,
//     //     about TEXT,
//     //     looking_for TEXT,
//     //     )
//     //
//     //   FOREIGN KEY (id) REFERENCES users(id)`
//     //   );
//   });
//   console.log('done initializing DB')
// }
//
// if (TESTING) {
//   // reset DB
//   fs.unlinkSync(DB_PATH);
//
//   // insert dummy data
//   withDB((conn) => {
//     conn.run(
//       `INSERT INTO users(id, type, name, email)
//         VALUES (
//           '1',
//           'employee',
//           'Alice A.',
//           'alice@aol.com'
//         )`
//     )
//
//     conn.run(
//       `INSERT INTO users(id, type, name, email)
//         VALUES (
//           '2',
//           'employee',
//           'Bob B.',
//           'bob@aol.com'
//         )`
//     )
//
//     conn.run(
//       `INSERT INTO users(id, type, name, email)
//         VALUES (
//           '3',
//           'employee',
//           'Charlie C.',
//           'charlie@aol.com'
//         )`
//     )
//
//     conn.each("SELECT * from users", function(err, row) {
//       console.log(row);
//     });
//   })
// }
