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
    const queryString = this.searchBar.current.value ? `&query=${encodeURI(this.searchBar.current.value)}` : "";

    window.location.href =
      `/search?category=${this.state.searchType}${queryString}`
  }

  handleSearchInput = (event) => {
    if (event.keyCode === 13) {
      this.doSearch()
    }
  }

  createSearchBar = () => {
      const style0 = (this.state.searchType === "employee") ? {backgroundColor:'#CCB8A8'} : {backgroundColor:'#C1D1EA'};
      const searchText = (this.state.searchType === "employee") ? "Search Employees" : "Search Jobs";

    return (<div className="row" id="search-bar">
      <div className="column" id="search-flexbox">
      <div className="row">
          <div id="search-wrapper">
              <input type="text" placeholder={searchText} onKeyUp={this.handleSearchInput} ref={this.searchBar}></input>
              <button id="search-button" onClick={this.doSearch}>&#x1F50D;</button>
          </div>
          <button style={style0} id="filter">[FilterTODO]</button>
      </div>
          {this.createAlternateSearchButton()}
      </div>
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
        <AuthenticationButton></AuthenticationButton>
    </div>)
  }
}
