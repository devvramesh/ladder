import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect} from "react-router-dom";
import {makeBackendRequest, getUrlParams} from "../util"

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    const params = getUrlParams(this);
    let searchType = params.category;
    if (searchType) {
      searchType = searchType.toLowerCase();
      if (searchType !== "employee" && searchType !== "employer") {
        searchType = "invalid";
      }
    } else {
      searchType = "invalid"
    }

    this.searchType = searchType;
    this.isValid = (searchType !== "invalid")
  }

  getResults() {
    // get URL params (i.e. /search?query=roofer) --> {query: "roofer"}
    const params = getUrlParams(this);

    makeBackendRequest('/api/search', params).then((result) => {
      console.log("fetched!");
      console.log(result)
      this.setState({data: result.data, searchType: result.searchType,});
      console.log("state changed!");
    })
  }

  render() {
    if (!this.isValid) {
      return (<div>invalid search</div>);
    }
    return (<div>
      <Navbar searchType={this.searchType}></Navbar>

    </div>)
  }
}
