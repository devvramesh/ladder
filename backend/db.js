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
    await client.query('BEGIN;')
    result = await fn(client)
    await client.query('COMMIT;')
  } catch (e) {
    await client.query('ROLLBACK;')
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
      );`
    )

    await client.query(
      `CREATE TABLE IF NOT EXISTS employees(
        auth0_user_id TEXT NOT NULL PRIMARY KEY,
        qualifications TEXT,
        about TEXT,
        looking_for TEXT,

        FOREIGN KEY (auth0_user_id) REFERENCES users(auth0_user_id)
      );`
    )

    await client.query(
      `CREATE TABLE IF NOT EXISTS employers(
        auth0_user_id TEXT NOT NULL PRIMARY KEY,
        about TEXT,
        logistics TEXT,

        FOREIGN KEY (auth0_user_id) REFERENCES users(auth0_user_id)
      );`
    )

    await client.query(
      `CREATE TABLE IF NOT EXISTS jobs(
        job_id SERIAL NOT NULL PRIMARY KEY,
        employer_auth0_user_id TEXT NOT NULL UNIQUE,
        job_title TEXT NOT NULL,
        description TEXT,
        qualifications TEXT,
        logistics TEXT,
        job_image_url TEXT,
        published BOOLEAN NOT NULL,

        FOREIGN KEY (employer_auth0_user_id) REFERENCES employers(auth0_user_id)
      );`
    )

    await client.query(
      `CREATE TABLE IF NOT EXISTS favorite_employees(
        favorite_id SERIAL NOT NULL PRIMARY KEY,
        favoritor_auth0_user_id TEXT NOT NULL,
        favoritee_auth0_user_id TEXT NOT NULL,

        FOREIGN KEY (favoritor_auth0_user_id) REFERENCES users(auth0_user_id),
        FOREIGN KEY (favoritee_auth0_user_id) REFERENCES employees(auth0_user_id)
      );`
    )

    await client.query(
      `CREATE TABLE IF NOT EXISTS favorite_employers(
        favorite_id SERIAL NOT NULL PRIMARY KEY,
        favoritor_auth0_user_id TEXT NOT NULL,
        favoritee_auth0_user_id TEXT NOT NULL,

        FOREIGN KEY (favoritor_auth0_user_id) REFERENCES users(auth0_user_id),
        FOREIGN KEY (favoritee_auth0_user_id) REFERENCES employers(auth0_user_id)
      );`
    )

    await client.query(
      `CREATE TABLE IF NOT EXISTS favorite_jobs(
        favorite_id SERIAL NOT NULL PRIMARY KEY,
        favoritor_auth0_user_id TEXT NOT NULL,
        favoritee_job_id INT NOT NULL,

        FOREIGN KEY (favoritor_auth0_user_id) REFERENCES users(auth0_user_id),
        FOREIGN KEY (favoritee_job_id) REFERENCES jobs(job_id)
      );`
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
      console.log(`${fixedWidthString(row.table_name, 18)} | ${row.columns}`)
    })
    console.log("----------------------------------------------------------------------------------------------------")
  })
}

export class Employee {
  constructor(auth0_user_id, username, name, email, phone=null, location=null, profile_img_url=null, qualifications=null, about=null, looking_for=null) {
    this.auth0_user_id = auth0_user_id;
    this.username = username;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.location = location;
    this.profile_img_url = profile_img_url;
    this.qualifications = qualifications;
    this.about = about;
    this.looking_for = looking_for;
  }

  async upsert(client) {
    await client.query(`
      INSERT INTO
        users(type, auth0_user_id, username, name, email, phone, location, profile_img_url)
      VALUES
        ('employee', $1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (auth0_user_id)
        DO UPDATE SET
          type = EXCLUDED.type,
          auth0_user_id = EXCLUDED.auth0_user_id,
          username = EXCLUDED.username,
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          location = EXCLUDED.location,
          profile_img_url = EXCLUDED.profile_img_url
      ;`,
      [this.auth0_user_id, this.username, this.name, this.email, this.phone, this.location, this.profile_img_url]
    )

    await client.query(`
      INSERT INTO
        employees(auth0_user_id, qualifications, about, looking_for)
      VALUES
        ($1, $2, $3, $4)
      ON CONFLICT (auth0_user_id)
        DO UPDATE SET
          auth0_user_id = EXCLUDED.auth0_user_id,
          qualifications = EXCLUDED.qualifications,
          about = EXCLUDED.about,
          looking_for = EXCLUDED.looking_for
      ;`,
      [this.auth0_user_id, this.qualifications, this.about, this.looking_for]
    )
  }

  static async find(client, auth0_user_id) {
    const result = await client.query(`
      SELECT u.auth0_user_id, u.username, u.name, u.email, u.phone, u.location, u.profile_img_url, e.qualifications, e.about, e.looking_for
      FROM
        users AS u
        JOIN employees AS e
        ON u.auth0_user_id = e.auth0_user_id
      WHERE
        u.auth0_user_id = $1
      ;`,
      [auth0_user_id]
    )

    return result ? Employee.ofRow(result.rows[0]) : null;
  }

  static ofRow(row) {
    return new Employee(row.auth0_user_id, row.username, row.name, row.email, row.phone, row.location, row.profile_img_url, row.qualifications, row.about, row.looking_for)
  }
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
