import React from "react";
import {Link} from "react-router-dom";
import LoginButton from "./login_button"
import AuthenticationButton from "./authentication_button"
import querystring from "querystring"
import "./navbar.css"

// NOTE(jake):
// props:
//    searchType:   either "employee" or "job"
//    initialSearchBarText: placeholder for searchbar
export default class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.searchBar = React.createRef();

    this.state = {
      searchType: this.props.searchType || "job"
    }
  }

  doSearch = () => {
    window.location.href = (
      `/search?category=${this.state.searchType}&query=${encodeURI(this.searchBar.current.value)}
      `)
  }

  handleSearchInput = (event) => {
    if (event.keyCode === 13) {
      this.doSearch()
    }
  }

  createSearchBar = () => {
      const style0 = (this.state.searchType === "employee") ? {backgroundColor:'#CCB8A8'} : {backgroundColor:'#C1D1EA'};

    return (<div className="row">
      <div class="column">
          <div>
          <input type="text" defaultValue={this.props.initialSearchBarText || ""} onKeyUp={this.handleSearchInput} ref={this.searchBar}></input>
          <button id="search" onClick={this.doSearch}>&#x1F50D;</button>
          </div>
          {this.createAlternateSearchButton()}
      </div>
      <button style={style0} id="filter">[Filter button (TODO)]</button>
    </div>)
  }

  createAlternateSearchButton = () => {
      const altSearchType = (this.state.searchType === "employee") ? "job" : "employee";

      const goToAltSearch = () => {
        this.setState({searchType: altSearchType})
      }

      return (
        <button id="alt-search" onClick={goToAltSearch}>Search {altSearchType}s instead</button>
      )

  }

  render() {
    return (<div className="row" id="navbar">
        <Link to="/">
          <button id="homebutton">
            <p className="logo">Ladder</p>
          </button>
        </Link>

        {this.createSearchBar()}
        <div>[Profile picture of current user, otherwise login/signup button (TODO)]</div>
        <AuthenticationButton></AuthenticationButton>
    </div>)
  }
}
