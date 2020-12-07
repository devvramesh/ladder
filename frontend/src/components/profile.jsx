import React from "react";
import Navbar from "./navbar"
import {makeBackendRequest} from "../util";
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
      currUserInfo = await makeBackendRequest(
        '/api/user_info',
        { userID: user.sub }
      )
    }

    let viewUserInfo = null;
    if (this.userToView) {
      viewUserInfo = await makeBackendRequest('/api/user_info', { username: this.userToView })
    }

    if (this.mounted) {
      this.setState({
        currUserInfo: currUserInfo,
        viewUserInfo: viewUserInfo,
        ready: !isLoading
      })
    }
  }

  async componentDidMount() {
    this.mounted = true;
    await this.load();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { isAuthenticated } = this.props.auth0;

    if (!this.state.ready) {
      return (<div>Loading...</div>);
    }

    // case 1: user visits /profile. must be authenticated, then will
    // be shown own profile
    if (!this.userToView) {
      if (!isAuthenticated) {
        return (<div>Error: must log in to view your profile</div>)
      }

      if (!this.state.currUserInfo || !this.state.currUserInfo.account_type) {
        return (<div>Error: please try again.</div>);
      }

      if (this.state.currUserInfo.account_type === "employee") {
        return (<div>
          <Navbar></Navbar>
          <div className="column" id="profile-main">
          <EmployeeProfile id={this.state.currUserInfo.auth0_user_id} editable={true}></EmployeeProfile>
          </div>
        </div>)
      } else if (this.state.currUserInfo.account_type === "employer") {
        return (<div>
          <Navbar></Navbar>
          <div className="column" id="profile-main">
          <EmployerProfile id={this.state.currUserInfo.auth0_user_id} editable={true}></EmployerProfile>
          </div>
        </div>)
      }

      return (<div>Error. Please try again.</div>)
    }

    // case 2: user vists (ex.) /profile/johnsmith1. will be shown
    // johnsmith1's profile, non-editable

    if (!this.state.viewUserInfo || !this.state.viewUserInfo.account_type) {
      return (<div>Error: user {this.userToView} not found.</div>)
    }

    if (isAuthenticated && (!this.state.currUserInfo || !this.state.currUserInfo.account_type)) {
      return (<div>Error: please try again.</div>);
    }

    if (this.state.viewUserInfo.account_type === "employee") {
      return (<div>
        <Navbar></Navbar>
        <div className="column" id="profile-main">
        <EmployeeProfile id={this.state.viewUserInfo.auth0_user_id} editable={false}></EmployeeProfile>
        </div>
      </div>)
    } else if (this.state.viewUserInfo.account_type === "employer") {
      return (<div>
        <Navbar></Navbar>
        <div className="column" id="profile-main">
        <EmployerProfile id={this.state.viewUserInfo.auth0_user_id} editable={false}></EmployerProfile>
        </div>
      </div>)
    }

    return (<div>Error. Please try again.</div>)
  }
}

export default withAuth0(Profile)
