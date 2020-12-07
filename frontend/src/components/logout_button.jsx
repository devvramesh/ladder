import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

// based on example in Auth0 Documentation

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button
      className="btn btn-danger btn-block"
      onClick={() =>
        logout({
          returnTo: window.location.origin, // homepage
        })
      }
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
