import React from "react";
import {Link} from "react-router-dom";
import {makeBackendRequest} from "../util"

// NOTE(jake):
// Required props:
//    searchType:   either "employee" or "employer"
export default class Navbar extends React.Component {
  createSearchBar = () => {
    return (<div className="">[Search Bar] search type:{this.props.searchType}
      [Filter button (TODO)]</div>)
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
    </div>)
  }
}
