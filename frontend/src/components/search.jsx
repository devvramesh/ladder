import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util"

export default class Search extends React.Component {
  constructor(props) {
    super(props);

    const params = getUrlParams(this);
    let searchType = params.category;
    if (searchType) {
      searchType = searchType.toLowerCase();
      if (searchType !== "employee" && searchType !== "job") {
        searchType = "invalid";
      }
    } else {
      searchType = "invalid"
    }

    this.searchType = searchType;
    this.isValid = (searchType !== "invalid")

    if (!this.isValid) {
      window.location.href = ('/search?category=employee');
    }

    this.state = {
      searchResults: [],
      ready: false
    }
  }

  componentDidMount() {
    // get URL params (i.e. /search?query=roofer) --> {query: "roofer"}
    const params = getUrlParams(this);

    makeBackendRequest('/api/search', params).then((result) => {
      console.log('fetched')
      console.log(result)
      this.setState({searchResults: result, ready: true});
    })
  }

  displayPreview = (entry) => {
    if (this.searchType === "employee") {
      return (<div>
        <h3>{entry.name || "[Name unavailable]"}</h3>
        <h4>{entry.category || "[Category unavailable]"}</h4>
        <h4>{entry.location || "[Location unavailable]"}</h4>
      </div>)
    } else if (this.searchType === "job") {
      return (<div>
        <h3>{entry.job_title || "[Job title unavailable]"}</h3>
        <h4>{entry.name || "[Employer unavailable]"}</h4>
        <h4>{entry.location || "[Location unavailable]"}</h4>
      </div>)
    } else {
      return null;
    }
  }

  displayEntry = (entry) => {
    return (<div>{JSON.stringify(entry)}</div>)
  }

  render() {
    console.log('rendering')
    const params = getUrlParams(this);

    if (!this.isValid || !this.state.ready) {
      return (<div>Loading...</div>)
    }
    console.log('rendering valid')
    console.log(this.state)
    return (<div>
      <Navbar searchType={this.searchType} initialSearchBarText={params.query}></Navbar>
      <h2>Search Results</h2>
      <Sidebar entries={this.state.searchResults} displayPreview={this.displayPreview} displayEntry={this.displayEntry}></Sidebar>
    </div>)
  }
}
