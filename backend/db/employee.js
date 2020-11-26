const DEFAULT_PROFILE_IMG = 'https://icon-library.com/images/default-profile-icon/default-profile-icon-16.jpg'


export default class Employee {
  constructor(auth0_user_id, username, name, email, phone=null, location=null, profile_img_url=DEFAULT_PROFILE_IMG, qualifications=null, about=null, looking_for=null) {
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

  async updateInDB(client) {
    await client.query(`
      INSERT INTO
        users(account_type, auth0_user_id, username, name, email, phone, location, profile_img_url)
      VALUES
        ('employee', $1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (auth0_user_id)
        DO UPDATE SET
          account_type = EXCLUDED.account_type,
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
        employees(auth0_user_id, about, qualifications, looking_for)
      VALUES
        ($1, $2, $3, $4)
      ON CONFLICT (auth0_user_id)
        DO UPDATE SET
        auth0_user_id = EXCLUDED.auth0_user_id,
        about = EXCLUDED.about,
        qualifications = EXCLUDED.qualifications,
        looking_for = EXCLUDED.looking_for
      ;`,
      [this.auth0_user_id, this.about, this.qualifications, this.looking_for]
    )
  }

  static async findInDB(client, auth0_user_id) {
    if (!auth0_user_id) {
      return null;
    }

    const result = await client.query(`
      SELECT u.auth0_user_id, u.account_type, u.username, u.name, u.email, u.phone, u.location, u.profile_img_url, e.qualifications, e.about, e.looking_for
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
    return new Employee(row.auth0_user_id, row.username, row.name, row.email, row.phone, row.location, row.profile_img_url, row.qualifications, row.about, row.looking_for)
  }
}
