import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util"
import { withAuth0 } from "@auth0/auth0-react";

class ViewJobs extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false

    this.userToView = this.props.match.params.username

    this.state = {
      currSelectedIndex: 0,
      jobs: [],
      currUserInfo: null,
      viewUserInfo: null,
      valid: true,
      ready: false
    }
  }

  loadUserInfo = async () => {
    const { user, isLoading } = this.props.auth0;

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

    console.log(currUserInfo)

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
    await this.loadUserInfo();
  }

  componentWillUnmount() {
    console.log('unmount')
    this.mounted = false;
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
    return (
      <div>
        [Job] {JSON.stringify(job)}
      </div>)
  }


  render() {
    console.log('rendering')

    const { isAuthenticated } = this.props.auth0;

    if (isAuthenticated && !this.state.currUserInfo) {
      this.loadUserInfo();
      return null;
    }

    if (!this.state.ready) {
      return null;
    }

    if (!this.state.valid) {
      return (<div>Error: jobs not found for user {this.userToView}</div>)
    }

    return (<div>
      <Navbar searchType={"this.searchType"}></Navbar>
      <h2>{`${this.state.viewUserInfo.name}'s`} Jobs</h2>
      <Sidebar entries={this.state.jobs} displayPreview={this.displayPreview} onSelect={this.displaySelection}></Sidebar>
      {
        this.displayJob(this.state.jobs[this.state.currSelectedIndex])
      }
    </div>)
  }
}

export default withAuth0(ViewJobs)
