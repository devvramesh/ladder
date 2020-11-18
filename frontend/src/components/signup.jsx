import React from "react";
import {makeBackendRequest} from "../util"

export default class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {data: "not ready yet!"};
  }

  componentDidMount() {
    console.log("fetching")
    makeBackendRequest("http://localhost:3001/api/login")
    .then(res => res.json())
    .then(
      (result) => {
        console.log("fetched!");
        console.log(result)
        this.setState({
          data: result.data
        });
        console.log("state changed!");
      }
    )
  }


  render() {
    return (<div>Sign-up Page! Welcome! {this.state.data}</div>)
  }
}
