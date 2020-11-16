import React from "react";

import { Link } from "react-router-dom";

export default class Home extends React.Component {
  render() {
    return (<div><h1>Homepage! Welcome!</h1>
      <Link to="/signup">
        <button variant="outlined">
          Sign up
        </button>
      </Link>
    </div>)
  }
}
