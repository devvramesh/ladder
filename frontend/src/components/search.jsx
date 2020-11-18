import React from "react";
import Navbar from "./navbar"
import {makeBackendRequest} from "../util"

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: "not ready yet!"
    };
  }

  componentDidMount() {
    makeBackendRequest(
      '/api/search',
      {firstParam: 'yourValue', secondParam: 'yourOtherValue'}
    )
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
    return (<div><Navbar></Navbar></div>)
  }
}
