const sqlite3 = require('sqlite3');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const util = require('./util')

const DB_DIRPATH = "./db"
mkdirp(DB_DIRPATH)
const DB_NAME = "ladder.sqlite3"
const DB_PATH = path.join(DB_DIRPATH, DB_NAME);

let initialized = false;

// NOTE(jake): delete eventually. just resets the DB each run
// and fills it with dummy data.
let TESTING = true;

withDB = (fn) => {
  let conn;
  let result;
  try {
    conn = new sqlite3.Database(DB_PATH);
    conn.serialize(() => {
      if (!initialized) {
        conn.serialize(() => dbInit(conn));
        initialized = true;
      }
      result = conn.serialize(() => fn(conn));
    })
  } finally {
    conn.close();
  }
  return result;
}

function dbInit(db) {
  console.log('initializing DB')
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users(
        id TEXT NOT NULL PRIMARY KEY,
        type TEXT NOT NULL CHECK(type = 'employee' OR type =='employer'),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT UNIQUE,
        location TEXT,
        profile_img BLOB
      )`
    )

    // db.run(
    //   `CREATE TABLE IF NOT EXISTS employees(
    //     id TEXT NOT NULL PRIMARY KEY,
    //     qualifications TEXT,
    //     about TEXT,
    //     looking_for TEXT,
    //     )
    //
    //   FOREIGN KEY (id) REFERENCES users(id)`
    //   );
  });
  console.log('done initializing DB')
}

if (TESTING) {
  // reset DB
  fs.unlinkSync(DB_PATH);

  // insert dummy data
  withDB((conn) => {
    conn.run(
      `INSERT INTO users(id, type, name, email)
        VALUES (
          '1',
          'employee',
          'Alice A.',
          'alice@aol.com'
        )`
    )

    conn.run(
      `INSERT INTO users(id, type, name, email)
        VALUES (
          '2',
          'employee',
          'Bob B.',
          'bob@aol.com'
        )`
    )

    conn.run(
      `INSERT INTO users(id, type, name, email)
        VALUES (
          '3',
          'employee',
          'Charlie C.',
          'charlie@aol.com'
        )`
    )

    conn.each("SELECT * from users", function(err, row) {
      console.log(row);
  });
  })
}
