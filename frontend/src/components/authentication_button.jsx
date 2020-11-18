import React from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { GetCurrentUserID } from "../util"

const AuthenticationButton = () => {
  const { isAuthenticated, user } = useAuth0();
  let name = "";
  if (user) {
    console.log(user)
    name = user.name;
  }


  return (<div>
    <p>
      Authenticated: {isAuthenticated.toString()}
    </p>
    <p>
      logged in as: {name}
    </p>
    <p>
      Current user ID/token: {(GetCurrentUserID() || "N/A")}
    </p>
   </div>);
};

export default AuthenticationButton;
