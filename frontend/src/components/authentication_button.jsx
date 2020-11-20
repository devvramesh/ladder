import {React, useState, useEffect} from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { GetCurrentUserID } from "../util"
import { GetCurrentUserAccountType } from "../util"
import LoginButton from "./login_button"
import LogoutButton from "./logout_button"

const AuthenticationButton = () => {
  const { isAuthenticated, user } = useAuth0();
  const [accountType, setAccountType] = useState('N/A');
  const _accountType = GetCurrentUserAccountType();

  let name = "";
  if (user) {
    console.log(user)
    name = user.name;
  }

  useEffect(() => {
    if (!_accountType) {
      return;
    }
    _accountType.then(setAccountType)
  }, [_accountType]);

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


  return (<div>
    <p>
      Authenticated: {isAuthenticated.toString()}
    </p>
    {createButtons()}
    <p>
      logged in as: {name}
    </p>
    <p>
      Current user ID/token: {(GetCurrentUserID() || "N/A")}
    </p>
    <div>Account type: {accountType}</div>
   </div>);
};

export default AuthenticationButton;
