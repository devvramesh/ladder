export default class User {
  static async findByID(client, id) {
    if (!id) {
      return null;
    }

    const result = await client.query(
      "SELECT * from users WHERE auth0_user_id = $1;",
      [id]
    )

    return (result.rowCount == 1) ? result.rows[0] : null;
  }

  static async findByUsername(client, username) {
    if (!username) {
      return null;
    }

    const result = await client.query(
      "SELECT * from users WHERE username = $1;",
      [username]
    )

    return (result.rowCount == 1) ? result.rows[0] : null;
  }
}
