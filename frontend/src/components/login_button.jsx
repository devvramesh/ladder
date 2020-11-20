import {React, useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = (props) => {
  const { loginWithRedirect } = useAuth0();

  const login = () => {
    loginWithRedirect({
      redirect_uri: props.redirectUri
    });
  }

  return (
    <div>
      <button
        className="btn btn-primary btn-block"
        onClick={login}
      >
        Log In
      </button>
    </div>
  );
};

export default LoginButton;
