export default class Employer {
  constructor(auth0_user_id, username, name, email, phone=null, location=null, profile_img_url=null, about=null, logistics=null) {
    this.auth0_user_id = auth0_user_id;
    this.username = username;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.location = location;
    this.profile_img_url = profile_img_url;
    this.about = about;
    this.logistics = logistics;
  }

  async createInDB(client) {
    console.log('creating employer')
    console.log(this)

    await client.query(`
      INSERT INTO
        users(type, auth0_user_id, username, name, email)
      VALUES
        ('employer', $1, $2, $3, $4)
      ON CONFLICT (auth0_user_id)
        DO UPDATE SET
          type = EXCLUDED.type,
          auth0_user_id = EXCLUDED.auth0_user_id,
          username = EXCLUDED.username,
          name = EXCLUDED.name,
          email = EXCLUDED.email
      ;`,
      [this.auth0_user_id, this.username, this.name, this.email]
    )

    await client.query(`
      INSERT INTO
        employers(auth0_user_id)
      VALUES
        ($1)
      ON CONFLICT DO NOTHING
      ;`,
      [this.auth0_user_id]
    )
  }

  async updateInDB(client) {
    await client.query(`
      UPDATE users
      SET
        phone = $2,
        location = $3,
        profile_img_url = $4
      WHERE auth0_user_id = $1
      ;`,
      [this.auth0_user_id, this.name, this.phone, this.location, this.profile_img_url]
    )

    await client.query(`
      UPDATE employers
      SET
        about = $2,
        logistics = $3
      WHERE auth0_user_id = $1
      ;`,
      [this.auth0_user_id, this.about, this.logistics]
    )
  }

  static async findInDB(client, auth0_user_id) {
    if (!auth0_user_id) {
      return null;
    }

    const result = await client.query(`
      SELECT u.auth0_user_id, u.username, u.name, u.email, u.phone, u.location, u.profile_img_url, e.about, e.logistics
      FROM
        users AS u
        JOIN employees AS e
        ON u.auth0_user_id = e.auth0_user_id
      WHERE
        u.auth0_user_id = $1
      ;`,
      [auth0_user_id]
    )

    return (result.rowCount == 1) ? result.rows[0] : null;
  }

  static ofRow(row) {
    return new Employer(row.auth0_user_id, row.username, row.name, row.email, row.phone, row.location, row.profile_img_url, row.about, row.logistics)
  }
}
