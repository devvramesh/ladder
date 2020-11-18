import React from "react";
import {Link} from "react-router-dom";
import LoginButton from "./login_button"
import AuthenticationButton from "./authentication_button"

// NOTE(jake):
// Required props:
//    searchType:   either "employee" or "employer"
export default class Navbar extends React.Component {
  handleSearchInput = (event) => {
    console.log(event);
  }

  createSearchBar = () => {
    return (<div className="">
      [Search Bar] <input type="text" onKeyUp={this.handleSearchInput}></input>
      search type:{this.props.searchType}
      <button>[Filter button (TODO)]</button>
    </div>)
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
      <LoginButton redirectUri={window.location.href}></LoginButton>
      <AuthenticationButton></AuthenticationButton>
    </div>)
  }
}
