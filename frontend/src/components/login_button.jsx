import {React, useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { GetCurrentUserAccountType } from "../util"

const LoginButton = (props) => {
  const [accountType, setAccountType] = useState('N/A');
  const { loginWithRedirect } = useAuth0();
  const _accountType = GetCurrentUserAccountType();

  const login = () => {
    loginWithRedirect({
      redirect_uri: props.redirectUri
    });
  }

  useEffect(() => {
    if (!_accountType) {
      return;
    }
    _accountType.then(setAccountType)
  }, [_accountType]);


  return (
    <div>
      <button
        className="btn btn-primary btn-block"
        onClick={login}
      >
        Log In
      </button>
      <div>Account type: {accountType}</div>
    </div>
  );
};

export default LoginButton;
