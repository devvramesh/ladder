import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect,} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util"

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

    this.state = {
      currSelectedIndex: 0,
      searchResults: []
    }
  }

  componentDidMount() {
    // get URL params (i.e. /search?query=roofer) --> {query: "roofer"}
    const params = getUrlParams(this);

    makeBackendRequest('/api/search', params).then((result) => {
      console.log('fetched')
      console.log(result)
      this.setState({searchResults: result.searchResults});
    })
  }

  displaySelection = (index) => {
    this.setState({currSelectedIndex: index})
  }

  displayPreview = (entry) => {
    return (<div>[Sidebar entry]</div>)
  }

  render() {
    console.log('rendering')
    if (!this.isValid) {
      return (<div>invalid search</div>);
    }
    console.log('rendering valid')
    console.log(this.state)
    return (<div>
      <Navbar searchType={this.searchType}></Navbar>
      <Sidebar entries={this.state.searchResults} displayPreview={this.displayPreview} onSelect={this.displaySelection}></Sidebar>
      <div className="border">[Current selected index: {this.state.currSelectedIndex}]</div>
    </div>)
  }
}
