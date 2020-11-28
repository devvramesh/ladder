export default class Favorites {
  static async updateFavoriteEmployee(client, favoritor_auth0_user_id, favoritee_auth0_user_id, favoriteStatus) {
    if (favoriteStatus) {
      // favoriteStatus === true --> insert favorite
      await client.query(`
        INSERT INTO
          favorite_employees(favoritor_auth0_user_id, favoritee_auth0_user_id)
        VALUES
          ($1, $2)
        ON CONFLICT DO NOTHING
        ;`,
        [favoritor_auth0_user_id, favoritee_auth0_user_id]
      )
    } else {
      // favoriteStatus === false --> delete favorite
      await client.query(`
        DELETE FROM favorite_employees
        WHERE
          favoritor_auth0_user_id = $1
          AND favoritee_auth0_user_id = $2
        ;`,
        [favoritor_auth0_user_id, favoritee_auth0_user_id]
      )
    }
  }

  static async getFavoriteEmployees(client, auth0_user_id) {
    const result = await client.query(`
      SELECT u.auth0_user_id, u.account_type, u.username, u.name, u.email, u.phone, u.location, u.profile_img_url, e.category, e.qualifications, e.about, e.looking_for
      FROM
        users AS u
        JOIN employees AS e
        ON u.auth0_user_id = e.auth0_user_id
        JOIN favorite_employees AS f
        ON u.auth0_user_id = f.favoritee_auth0_user_id
      WHERE
        f.favoritor_auth0_user_id = $1
      ;`,
      [auth0_user_id]
    )

    return result.rows
  }

  static async isFavoriteEmployee(client,favoritor_auth0_user_id, favoritee_auth0_user_id) {
    const result = await client.query(`
      SELECT COUNT(*)
      FROM favorite_employees
      WHERE
        favoritor_auth0_user_id = $1
        AND favoritee_auth0_user_id = $2
      ;`,
      [favoritor_auth0_user_id, favoritee_auth0_user_id]
    )

    return result.rows[0].count > 0
  }

  static async updateFavoriteEmployer(client, favoritor_auth0_user_id, favoritee_auth0_user_id, favoriteStatus) {
    if (favoriteStatus) {
      // favoriteStatus === true --> insert favorite
      await client.query(`
        INSERT INTO
          favorite_employers(favoritor_auth0_user_id, favoritee_auth0_user_id)
        VALUES
          ($1, $2)
        ON CONFLICT DO NOTHING
        ;`,
        [favoritor_auth0_user_id, favoritee_auth0_user_id]
      )
    } else {
      // favoriteStatus === false --> delete favorite
      await client.query(`
        DELETE FROM favorite_employers
        WHERE
          favoritor_auth0_user_id = $1
          AND favoritee_auth0_user_id = $2
        ;`,
        [favoritor_auth0_user_id, favoritee_auth0_user_id]
      )
    }
  }

  static async getFavoriteEmployers(client, auth0_user_id) {
    const result = await client.query(`
      SELECT u.auth0_user_id, u.account_type, u.username, u.name, u.email, u.phone, u.location, u.profile_img_url, e.about, e.logistics
      FROM
        users AS u
        JOIN employers AS e
        ON u.auth0_user_id = e.auth0_user_id
        JOIN favorite_employers AS f
        ON u.auth0_user_id = f.favoritee_auth0_user_id
      WHERE
        f.favoritor_auth0_user_id = $1
      ;`,
      [auth0_user_id]
    )

    return result.rows
  }

  static async isFavoriteEmployer(client,favoritor_auth0_user_id, favoritee_auth0_user_id) {
    const result = await client.query(`
      SELECT COUNT(*)
      FROM favorite_employers
      WHERE
        favoritor_auth0_user_id = $1
        AND favoritee_auth0_user_id = $2
      ;`,
      [favoritor_auth0_user_id, favoritee_auth0_user_id]
    )

    return result.rows[0].count > 0
  }

  static async updateFavoriteJob(client, favoritor_auth0_user_id, favoritee_job_id, favoriteStatus) {
    if (favoriteStatus) {
      // favoriteStatus === true --> insert favorite
      await client.query(`
        INSERT INTO
          favorite_jobs(favoritor_auth0_user_id, favoritee_job_id)
        VALUES
          ($1, $2)
        ON CONFLICT DO NOTHING
        ;`,
        [favoritor_auth0_user_id, favoritee_job_id]
      )
    } else {
      // favoriteStatus === false --> delete favorite
      await client.query(`
        DELETE FROM favorite_jobs
        WHERE
          favoritor_auth0_user_id = $1
          AND favoritee_job_id = $2
        ;`,
        [favoritor_auth0_user_id, favoritee_job_id]
      )
    }
  }

  static async getFavoriteJobs(client, auth0_user_id) {
    const result = await client.query(`
      SELECT *
      FROM
        jobs AS j
        JOIN employers AS e
        ON j.employer_auth0_user_id = e.auth0_user_id
        JOIN favorite_jobs AS f
        ON j.job_id = f.favoritee_job_id
      WHERE
        f.favoritor_auth0_user_id = $1
      ;`,
      [auth0_user_id]
    )

    return result.rows
  }

  static async isFavoriteJob(client,favoritor_auth0_user_id, favoritee_job_id) {
    const result = await client.query(`
      SELECT COUNT(*)
      FROM favorite_jobs
      WHERE
        favoritor_auth0_user_id = $1
        AND favoritee_job_id = $2
      ;`,
      [favoritor_auth0_user_id, favoritee_job_id]
    )

    return result.rows[0].count > 0
  }
}
