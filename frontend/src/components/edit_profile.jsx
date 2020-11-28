import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util";
import EditableEmployeeProfile from "./edit_employee_profile"
import EditableEmployerProfile from "./edit_employer_profile"
import { withAuth0 } from "@auth0/auth0-react";
import { GetCurrentUserID } from "../util"

class EditProfile extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      userInfo: null,
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

    if (this.mounted) {
      console.log('setting state!')
      this.setState({
        userInfo: userInfo,
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

  render() {
    console.log('rendering')

    const { isAuthenticated } = this.props.auth0;

    if (!this.state.ready) {
      return (<div>Loading...</div>);
    }

    if (isAuthenticated && !this.state.userInfo && !this.state.userInfo.account_type) {
      return (<div>Error: please try again.</div>);
    }

    if (!isAuthenticated) {
      return (<div>Error: must be logged in to edit your profile.</div>)
    }

    if (this.state.userInfo.account_type === "employee") {
      console.log('editing employee...')
      return (<EditableEmployeeProfile></EditableEmployeeProfile>)
    } else if (this.state.userInfo.account_type === "employer") {
      console.log('editing employer...')
      return (<EditableEmployerProfile></EditableEmployerProfile>)
    }

    return (<div>Error. Please try again.</div>)
  }
}

export default withAuth0(EditProfile)
