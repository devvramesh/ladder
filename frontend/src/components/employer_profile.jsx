import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util"

export default class EmployerProfile extends React.Component {
  constructor(props) {
    super(props);


  }



  render() {
    return (<div>
      <h2>Profile</h2>
    </div>)
  }
}
