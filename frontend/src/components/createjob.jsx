import React from "react";
import { makeBackendRequest } from "../util"
import { Link } from "react-router-dom";
import { withAuth0 } from "@auth0/auth0-react";
import "./createjob.css"

class CreateJob extends React.Component {
  constructor(props) {
    super(props);

    this.jobTitle = React.createRef();
    this.description = React.createRef();
    this.qualifications = React.createRef();
    this.logistics = React.createRef();

    this.mounted = false;

    this.job_id = this.props.match.params.job_id || -1

    this.state = {
      userInfo: null,
      jobInfo: null,
      ready: false
    }
  }

  load = async () => {
    const { user, isLoading } = this.props.auth0;

    if (isLoading) {
      setTimeout(this.load, 100)
      return;
    }

    if (this.state.ready) {
      return;
    }

    let userInfo = null;
    if (user) {
      userInfo = await makeBackendRequest(
        '/api/user_info',
        { userID: user.sub }
      )
    }

    console.log(userInfo)

    let jobInfo = null;
    if (this.job_id >= 0) {
      jobInfo = await makeBackendRequest(
        '/api/job_info',
        { job_id: this.job_id }
      )
    }

    if (this.mounted) {
      this.setState({
        userInfo: userInfo,
        jobInfo: jobInfo,
        ready: !isLoading
      })
    }
  }

  async componentDidMount() {
    console.log('didMount')
    this.mounted = true;
    await this.load();
  }

  componentWillUnmount() {
    console.log('unmount')
    this.mounted = false;
  }

  save = async (publish) => {
    const { user, getAccessTokenSilently } = this.props.auth0;

    // TODO: if we want to add a save-without-exit option,
    // we can use the return value of this as job_id
    // and redirect to /jobs/{job_id}
    await makeBackendRequest('/api/update_job', {
      employer_auth0_user_id: user.sub,
      job_id: this.job_id,
      job_title: this.jobTitle.current.value,
      description: this.description.current.value,
      qualifications: this.qualifications.current.value,
      logistics: this.logistics.current.value,
      published: publish,
      access_token: await getAccessTokenSilently()
    })

    window.location.href = '/jobs'
  }

  render() {
    const { isAuthenticated, user } = this.props.auth0;

    if (!this.state.ready) {
      return (<div>Loading...</div>);
    }

    if (isAuthenticated && !this.state.userInfo && !this.state.userInfo.account_type) {
      return (<div>Error: please try again.</div>);
    }

    if (!isAuthenticated) {
      return (<div>Error: must log in to create a job post</div>)
    }

    if (this.state.userInfo.account_type !== "employer") {
      return (<div>Error: must be logged in as an employer to create a job post</div>)
    }

    if ((this.job_id >= 0 && !this.state.jobInfo) ||
      (this.state.jobInfo && this.state.jobInfo.employer_auth0_user_id && this.state.jobInfo.employer_auth0_user_id !== user.sub)) {
      return (<div>Error: you can only edit your own job posting</div>)
    }

    return (
      <div className="column-centered">
        <div className="column" id="create-job">
          <h2>Create a Job</h2>
          <h4>Job Title</h4>
          <input placeholder="Job Title" ref={this.jobTitle} defaultValue={this.state.jobInfo ? this.state.jobInfo.job_title : ""} />
          <h4>Job Description</h4>
          <textarea placeholder="Job Description" ref={this.description} defaultValue={this.state.jobInfo ? this.state.jobInfo.description : ""} />
          <h4>Job Qualifications</h4>
          <textarea placeholder="Job Qualifications" ref={this.qualifications} defaultValue={this.state.jobInfo ? this.state.jobInfo.qualifications : ""} />
          <h4>Logistics</h4>
          <textarea placeholder="Logistics" ref={this.logistics} defaultValue={this.state.jobInfo ? this.state.jobInfo.logistics : ""} />
          <div className="row" id="job-submitexit">
            <button onClick={() => this.save(false)} >Save & Exit</button>
            <button onClick={() => this.save(true)} >Publish, Save & Exit</button>
          </div>
          <div className="row">
            <Link to="/jobs" id="job-link-cancel">
              <button id="job-cancel">Cancel</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default withAuth0(CreateJob)
