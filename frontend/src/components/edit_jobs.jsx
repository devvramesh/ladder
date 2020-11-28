import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util"
import { withAuth0 } from "@auth0/auth0-react";

class EditJobs extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false

    this.state = {
      currSelectedIndex: 0,
      jobs: [],
      userInfo: null,
      ready: false
    }
  }

  loadUserInfo = async () => {
    const { user, isLoading } = this.props.auth0;

    let userInfo = null;
    let jobs = []
    if (user) {
      userInfo = await makeBackendRequest(
        '/api/user_info',
        { userID: user.sub }
      )

      jobs = await this.getJobs()
    }

    console.log(userInfo)

    if (this.mounted) {
      console.log('setting state!')
      this.setState({
        userInfo: userInfo,
        jobs: jobs,
        ready: !isLoading
      })
    }
  }

  getJobs = async () => {
    const { user } = this.props.auth0;
    let jobs = []

    if (user) {
      jobs = await makeBackendRequest(
        '/api/get_jobs',
        { userID: user.sub, published: false }
      )
    }

    console.log('got jobs:')
    console.log(jobs)
    return jobs
  }


  async componentDidMount() {
    console.log('didMount')
    this.mounted = true;
    await this.loadUserInfo();
  }

  componentWillUnmount() {
    console.log('unmount')
    this.mounted = false;
  }

  setPublished = async (job, publish) => {
    let body = job;
    body.published = publish

    await makeBackendRequest('/api/update_job', body)
    const jobs = await this.getJobs()
    this.setState({
      jobs: jobs
    })
  }

  deleteJob = async (job_id) => {
    await makeBackendRequest('/api/delete_job', {job_id : job_id})
    const jobs = await this.getJobs()
    console.log('job just deleted. setting state')
    console.log(jobs)
    this.setState({
      jobs: jobs
    })
  }

  displaySelection = (index) => {
    this.setState({currSelectedIndex: index})

  }

  displayPreview = (entry) => {
    return (<div>[Sidebar entry] {JSON.stringify(entry)}</div>)
  }

  displayJob = (job) => {
    if (!job) {
      return null;
    }
    ;
    let publishButton;
    if (job.published) {
      publishButton = (<button onClick={() => this.setPublished(job, false)}>Unpublish</button>)
    } else {
      publishButton = (<button onClick={() => this.setPublished(job, true)}>Publish</button>)
    }

    return (
      <div>
        <Link to={`/edit_job/${job.job_id}`}>
          <button>Edit</button>
        </Link>
        {publishButton}
        <button onClick={() => this.deleteJob(job.job_id)}>Delete</button>
        [Job] {JSON.stringify(job)}
      </div>)
  }


  render() {
    console.log('rendering')

    const { isAuthenticated } = this.props.auth0;

    if (isAuthenticated && !this.state.userInfo) {
      this.loadUserInfo();
      return null;
    }

    if (!this.state.ready) {
      return null;
    }

    if (!this.state.userInfo) {
      return null;
    }

    if (!isAuthenticated) {
      return (<div>Error: must log in to view your job posts</div>)
    }

    if (this.state.userInfo.account_type !== "employer") {
      return (<div>Error: must be logged in as an employer to view your job posts</div>)
    }

    console.log('rendering jobs:')
    console.log(this.state.jobs)

    return (<div>
      <Navbar searchType={"this.searchType"}></Navbar>
      <h2>My Jobs</h2>
      <Link to="/create_job">
        <button>New Job</button>
      </Link>
      <Sidebar entries={this.state.jobs} displayPreview={this.displayPreview} onSelect={this.displaySelection}></Sidebar>
      {
        this.displayJob(this.state.jobs[this.state.currSelectedIndex])
      }
    </div>)
  }
}

export default withAuth0(EditJobs)
