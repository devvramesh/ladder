import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import { Link, Redirect, withRouter } from "react-router-dom";
import { makeBackendRequest, getUrlParams, } from "../util"
import { withAuth0 } from "@auth0/auth0-react";
import JobView from "./job_view"

class ViewJobs extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false

    this.userToView = this.props.match.params.username

    this.state = {
      jobs: [],
      currUserInfo: null,
      viewUserInfo: null,
      valid: true,
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

    let currUserInfo = null;
    if (user) {
      currUserInfo = await makeBackendRequest('/api/user_info', {
        userID: user.sub
      })
    }

    const viewUserInfo = await makeBackendRequest('/api/user_info', {
      username: this.userToView
    })

    let jobs = []
    let valid = true;
    if (viewUserInfo && viewUserInfo.account_type === "employer") {
      jobs = await this.getJobs(viewUserInfo.auth0_user_id)
    } else {
      valid = false;
    }

    if (this.mounted) {
      console.log('setting state!')
      this.setState({
        currUserInfo: currUserInfo,
        viewUserInfo: viewUserInfo,
        jobs: jobs,
        valid: valid,
        ready: !isLoading
      })
    }
  }

  getJobs = async (id) => {
    return await makeBackendRequest(
      '/api/get_jobs',
      { userID: id, published: true }
    )
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

  displayPreview = (entry) => {
    return (<div>
      <h3>{entry.job_title || "[Job title unavailable]"}</h3>
      <h4>{this.state.viewUserInfo.name || "[Employer unavailable]"}</h4>
      <h4>{this.state.viewUserInfo.location || "[Location unavailable]"}</h4>
    </div>)
  }

  displayJob = (job, deleteFn) => {
    return(<JobView key={job.job_id} job_id={job.job_id} editable={false} deleteFromSidebar={deleteFn}></JobView>)
  }


  render() {
    console.log('rendering')

    const { isAuthenticated } = this.props.auth0;

    if (!this.state.ready) {
      return (<div>Loading...</div>);
    }

    if (isAuthenticated && (!this.state.currUserInfo || !this.state.currUserInfo.account_type)) {
      return (<div>Error: please try again.</div>);
    }

    if (!this.state.valid) {
      return (<div>Error: jobs not found for user {this.userToView}</div>)
    }

    return (<div>
      <Navbar searchType={this.searchType}></Navbar>
      <h2>{`${this.state.viewUserInfo.name}'s`} Jobs</h2>
      <Sidebar entries={this.state.jobs} displayPreview={this.displayPreview}
        displayEntry={this.displayJob}></Sidebar>
    </div>)
  }
}

export default withAuth0(ViewJobs)
