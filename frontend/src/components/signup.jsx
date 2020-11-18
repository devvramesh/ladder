import React from "react";
import {makeBackendRequest} from "../util"

export default class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: "not ready yet!"
    };
  }

  render() {
    return (<div>Sign-up Page! Welcome! {this.state.data}</div>)
  }
}
