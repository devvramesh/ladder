import React from "react";

import { withAuth0 } from "@auth0/auth0-react";
import { makeBackendRequest } from "../util"
import LoginButton from "./login_button"
import LogoutButton from "./logout_button"

class AuthenticationButton extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      userInfo: null,
      ready: false
    }
  }

  loadUserInfo = async () => {
    const { isLoading, user } = this.props.auth0;
    if (isLoading || !user) {
      this.setState({ userInfo: null });
    } else {
      await makeBackendRequest('/api/user_info', {userID:user.sub}).then((info) => {
        if (this.mounted) {
          console.log(info)
          this.setState({
            userInfo: info,
            ready: true
          })
        }
      })
    }
  }

  async componentDidMount() {
    console.log('didMount')
    this.mounted = true;
    await this.loadUserInfo()
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  goToProfile = () => {
    window.location.href = "/profile"
  }

  createButtons = (isAuthenticated) => {
    if (isAuthenticated) {
      return (<div>
        <LogoutButton redirectUri={window.location.href}></LogoutButton>
          <button
            className="btn btn-primary btn-block"
            onClick={this.goToProfile}
          >
            Go to Profile
          </button>
    </div>)
    }
    return (<LoginButton redirectUri={window.location.origin}></LoginButton>)
  }

  showUser = () => {
    if (this.state.userInfo) {
      return (<div>
        <div>Account type: {this.state.userInfo.accountType}</div>
        <div>Username: {this.state.userInfo.username}</div>
      </div>)
    } else {
      return (<div></div>)
    }
  }

  render() {
    console.log('authbutton render')
    const { isAuthenticated, user } = this.props.auth0;

    if (isAuthenticated && !this.state.userInfo) {
      console.log('authbutton render1')
      this.loadUserInfo();
      return null
    }


    if (!this.state.ready) {
      console.log('authbutton render2')
      return null;
    }

    return (<div>
      <p>
        Authenticated: {isAuthenticated.toString()}
      </p>
      {this.createButtons(isAuthenticated)}
      <p>
        logged in as: {user ? user.name : null}
      </p>
      <p>
        Current user ID/token: {(user ? user.sub : "N/A")}
      </p>
      {this.showUser()}
     </div>);
   }
};

export default withAuth0(AuthenticationButton);
