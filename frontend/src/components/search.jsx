import React from "react";
import Navbar from "./navbar"
import {makeBackendRequest, getUrlParams} from "../util"

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: "not ready yet!"
    };
  }

  componentDidMount() {
    // get URL params (i.e. /search?query=roofer) --> {query: "roofer"}
    const params = getUrlParams(this);

    makeBackendRequest(
      '/api/search',
      params
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
