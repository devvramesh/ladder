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
    const { user, isLoading } = this.props.auth0;
    let userInfo = null;
    if (user) {
      userInfo = await makeBackendRequest('/api/user_info', {userID:user.sub})
      console.log('got user')
      console.log(user)
      console.log('got userInfo')
      console.log(userInfo)
    }
    if (this.mounted) {
      console.log(userInfo)
      this.setState({
        userInfo: userInfo,
        ready: !isLoading
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
        <div>Account type: {this.state.userInfo.account_type}</div>
        <div>Username: {this.state.userInfo.username}</div>
      </div>)
    } else {
      return (<div></div>)
    }
  }

  render() {
    const { isAuthenticated, user } = this.props.auth0;
    console.log('authbutton render')

    if (isAuthenticated && !this.state.userInfo) {
      console.log('authbutton render1')
      this.loadUserInfo();
      return null;
    }

    if (!this.state.ready) {
      console.log('authbutton render2')
      return null;
    }

    console.log('authbutton render3')
    console.log(this.state)

    return (<div>
      <p>
        Authenticated: {isAuthenticated.toString()}
      </p>
      {this.createButtons(isAuthenticated)}
      <p>
        logged in as: {isAuthenticated ? this.state.userInfo.name : null}
      </p>
      <p>
        Current user ID/token: {(user ? user.sub : "N/A")}
      </p>
      {this.showUser()}
     </div>);
   }
};

export default withAuth0(AuthenticationButton);
