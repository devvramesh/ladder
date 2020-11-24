import {React, useState, useEffect} from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { GetCurrentUserID, GetCurrentUserInfo } from "../util"
import LoginButton from "./login_button"
import LogoutButton from "./logout_button"

const AuthenticationButton = () => {
  const { isAuthenticated, user } = useAuth0();
  const [ userInfo, setUserInfo ] = useState(null);
  const _userInfo = GetCurrentUserInfo();

  useEffect(() => {
    if (!_userInfo) {
      return;
    }
    _userInfo.then(setUserInfo)
  }, [_userInfo]);

  const goToProfile = () => {
    window.location.href = "/profile"
  }

  const createButtons = () => {
    if (isAuthenticated) {
      return (<div>
        <LogoutButton redirectUri={window.location.href}></LogoutButton>
          <button
            className="btn btn-primary btn-block"
            onClick={goToProfile}
          >
            Go to Profile
          </button>
    </div>)
    }
    return (<LoginButton redirectUri={window.location.href}></LoginButton>)
  }

  const showUser = () => {
    if (userInfo) {
      return (<div>
        <div>Account type: {userInfo.accountType}</div>
        <div>Username: {userInfo.username}</div>
      </div>)
    } else {
      return (<div></div>)
    }
  }


  return (<div>
    <p>
      Authenticated: {isAuthenticated.toString()}
    </p>
    {createButtons()}
    <p>
      logged in as: {user ? user.name : null}
    </p>
    <p>
      Current user ID/token: {(GetCurrentUserID() || "N/A")}
    </p>
    {showUser()}
   </div>);
};

export default AuthenticationButton;
