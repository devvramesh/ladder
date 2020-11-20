import React from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { GetCurrentUserID } from "../util"
import LoginButton from "./login_button"
import LogoutButton from "./logout_button"

const AuthenticationButton = () => {
  const { isAuthenticated, user } = useAuth0();
  let name = "";
  if (user) {
    console.log(user)
    name = user.name;
  }

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
   </div>);
};

export default AuthenticationButton;
