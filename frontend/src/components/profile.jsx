import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util";
import EmployeeProfile from "./employee_profile"
import EmployerProfile from "./employer_profile"
import { withAuth0 } from "@auth0/auth0-react";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    // match params from route i.e. /profile/johnsmith1 --> "johnsmith1"
    // null on /profile which will show logged-in user's profile, editable
    this.userToView = this.props.match.params.username || null;

    this.mounted = false;

    this.state = {
      currUserInfo: null,
      viewUserInfo: null,
      ready: false
    }
  }

  loadUserInfo = async () => {
    const { user, isLoading } = this.props.auth0;
    console.log('loaduserinfo')
    console.log(user)

    let currUserInfo = null;
    if (user) {
      currUserInfo = await makeBackendRequest(
        '/api/user_info',
        { userID: user.sub }
      )
    }

    console.log('h2')
    console.log(currUserInfo)

    let viewUserInfo = null;
    if (this.userToView) {
      viewUserInfo = await makeBackendRequest('/api/user_info', { username: this.userToView })
    }

    if (this.mounted) {
      console.log('setting state!')
      console.log(currUserInfo)
      console.log(user)
      console.log(isLoading)
      this.setState({
        currUserInfo: currUserInfo,
        viewUserInfo: viewUserInfo,
        ready: !isLoading
      })
    }
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

  render() {
    console.log('rendering')

    const { isAuthenticated } = this.props.auth0;

    if (isAuthenticated && !this.state.currUserInfo) {
      console.log('load info needed')
      this.loadUserInfo();
      return null;
    }

    if (!this.state.ready) {
      return null;
    }

    console.log('ready')

    // case 1: user visits /profile. must be authenticated, then will
    // be shown own profile
    if (!this.userToView) {
      console.log('authenticated')
      console.log(this.state)

      if (!this.state.currUserInfo) {
        return null;
      }

      if (!isAuthenticated) {
        return (<div>Error: must log in to view your profile</div>)
      }

      if (this.state.currUserInfo.account_type === "employee") {
        return (<EmployeeProfile id={this.state.currUserInfo.auth0_user_id} editable={true}></EmployeeProfile>)
      } else if (this.state.currUserInfo.account_type === "employer") {
        return (<EmployerProfile id={this.state.currUserInfo.auth0_user_id} editable={true}></EmployerProfile>)
      }

      return (<div>Error. Please try again.</div>)
    }

    // case 2: user vists (ex.) /profile/johnsmith1. will be shown
    // johnsmith1's profile, non-editable
    console.log('case 2')

    if (!this.state.viewUserInfo.account_type) {
      return (<div>Error: user {this.userToView} not found.</div>)
    }

    console.log(this.state)

    if (this.state.viewUserInfo.account_type === "employee") {
      return (<EmployeeProfile id={this.state.viewUserInfo.auth0_user_id} editable={false}></EmployeeProfile>)
    } else if (this.state.viewUserInfo.account_type === "employer") {
      return (<EmployerProfile id={this.state.viewUserInfo.auth0_user_id} editable={false}></EmployerProfile>)
    }

    return (<div>Error. Please try again.</div>)
  }
}

export default withAuth0(Profile)
