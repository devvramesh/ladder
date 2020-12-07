import {React} from "react";
import { useAuth0 } from "@auth0/auth0-react";

// based on example in Auth0 Documentation

const LoginButton = (props) => {
  const { loginWithRedirect } = useAuth0();

  const login = async () => {
    await loginWithRedirect({
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
