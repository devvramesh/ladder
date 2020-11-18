import React from "react";
import {Link} from "react-router-dom";
import {makeBackendRequest} from "../util"
import Navbar from "./navbar";

export default class Home extends React.Component {
  render() {
    return (<div>
      <h1>Homepage! Welcome!</h1>
      <Navbar></Navbar>
      <div>Note: the navbar is just here for testing, feel free to remove it.</div>
    </div>)
  }
}
