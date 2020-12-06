const DEFAULT_PROFILE_IMG = 'https://icon-library.com/images/default-profile-icon/default-profile-icon-16.jpg'

export default class Job {
  constructor(job_id, employer_auth0_user_id, job_title, description=null, qualifications=null, logistics=null, job_image_url=null, published=false) {
    this.job_id = job_id;
    this.employer_auth0_user_id = employer_auth0_user_id;
    this.job_title = job_title;
    this.description = description;
    this.qualifications = qualifications;
    this.logistics = logistics;
    this.job_image_url = job_image_url;
    this.published = published;
  }

  async createInDB(client) {
    const result = await client.query(`
      INSERT INTO
        jobs(employer_auth0_user_id, job_title, description, qualifications, logistics, job_image_url, published)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING job_id
      ;`,
      [this.employer_auth0_user_id, this.job_title, this.description, this.qualifications, this.logistics, this.job_image_url, this.published]
    )

    return (result.rowCount == 1) ? result.rows[0].job_id : null;
  }

  async updateInDB(client) {
    await client.query(`
      UPDATE jobs
      SET
        job_title = $3,
        description = $4,
        qualifications = $5,
        logistics = $6,
        job_image_url = $7,
        published = $8
      WHERE job_id = $1 AND employer_auth0_user_id = $2
      ;`,
      [this.job_id, this.employer_auth0_user_id, this.job_title, this.description, this.qualifications, this.logistics, this.job_image_url, this.published]
    )
  }

  static async deleteFromDB(client, job_id, auth0_user_id) {
    await client.query(`
      DELETE FROM jobs
      WHERE job_id = $1 AND employer_auth0_user_id = $2
      ;`,
      [job_id, auth0_user_id]
    )
  }

  static async findInDB(client, job_id) {
    if (!job_id) {
      return null;
    }

    const result = await client.query(`
      SELECT *
      FROM
        jobs
        JOIN employers
        ON jobs.employer_auth0_user_id = employers.auth0_user_id
      WHERE
        job_id = $1
      ;`,
      [job_id]
    )

    return (result.rowCount == 1) ? result.rows[0] : null;
  }

  static async findByEmployerInDB(client, employer_auth0_user_id, published) {
    if (!employer_auth0_user_id) {
      return null;
    }

    const andPublished = published ? 'AND jobs.published = TRUE' : ''
    const result = await client.query(`
      SELECT *
      FROM
        jobs
        JOIN employers
        ON jobs.employer_auth0_user_id = employers.auth0_user_id
      WHERE
        jobs.employer_auth0_user_id LIKE $1
        ${andPublished}
      ORDER BY job_id ASC
      ;`,
      [employer_auth0_user_id]
    )

    return result.rows
  }

  static async searchInDB(client, query) {
    // TODO: improve search. right now it's super basic
    const result = await client.query(`
      SELECT *
      FROM
        jobs AS j
        JOIN employers AS e
        ON j.employer_auth0_user_id = e.auth0_user_id
        JOIN users AS u
        ON u.auth0_user_id = e.auth0_user_id
      WHERE
        j.published = TRUE AND
        LOWER(CONCAT(u.username, u.name, u.email, u.phone, u.location, e.about, e.logistics, j.job_title, j.description, j.qualifications, j.logistics)) LIKE LOWER($1)
      ;`,
      [`%${query}%`]
    )

    return result.rows
  }
}
