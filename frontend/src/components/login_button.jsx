import {React, useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = (props) => {
  const { loginWithRedirect } = useAuth0();

  const login = async () => {
    console.log(props.redirectUri)
    await loginWithRedirect({
      // can't get this to work for anything but the homepage
      // even though I'm doing everything auth0 says
      redirectUri: props.redirectUri
    });
  }

  return (
    <button style={props.style}
        className="btn btn-primary btn-block"
        onClick={login}
      >
        Log In
    </button>
  );
};

export default LoginButton;
