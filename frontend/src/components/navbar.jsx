import React from "react";
import {Link} from "react-router-dom";
import LoginButton from "./login_button"
import AuthenticationButton from "./authentication_button"
import querystring from "querystring"

// NOTE(jake):
// props:
//    searchType:   either "employee" or "job"
//    initialSearchBarText: placeholder for searchbar
export default class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchType: this.props.searchType
    }
  }

  doSearch = () => {
    console.log(document.getElementById('searchInput'))
    window.location.href = (
      `/search?category=${this.state.searchType}&query=${encodeURI(document.getElementById('searchInput').value)}
      `)
  }

  handleSearchInput = (event) => {
    if (event.keyCode === 13) {
      this.doSearch()
    }
  }

  createSearchBar = () => {
    return (<div className="">
      [Search Bar] <input id="searchInput" type="text" defaultValue={this.props.initialSearchBarText || ""} onKeyUp={this.handleSearchInput}></input>
    <button onClick={this.doSearch}>&#x1F50D;</button>
      search type:{this.state.searchType}
      <button>[Filter button (TODO)]</button>
      {this.createAlternateSearchButton()}
    </div>)
  }

  createAlternateSearchButton = () => {
      const altSearchType = (this.state.searchType === "employee") ? "job" : "employee";

      const goToAltSearch = () => {
        this.setState({searchType: altSearchType})
      }

      return (
        <button onClick={goToAltSearch}>Search {altSearchType}s instead</button>
      )

  }

  render() {
    return (<div className="border">[Navbar component]
      <div className="">
        <Link to="/">
          <button variant="outlined">
            [Ladder logo -- link to homepage]
          </button>
        </Link>
      </div>
      {this.createSearchBar()}
      <div>[Profile picture of current user, otherwise login/signup button (TODO)]</div>
      <AuthenticationButton></AuthenticationButton>
    </div>)
  }
}
