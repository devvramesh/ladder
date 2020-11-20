import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util"

export default class Jobs extends React.Component {
  constructor(props) {
    super(props);
    

    this.state = {
      currSelectedIndex: 0,
      jobs: ["Roofer"]
    }
  }

  displaySelection = (index) => {
    this.setState({currSelectedIndex: index})

  }

  displayPreview = (entry) => {
    return (<div>[Sidebar entry] {JSON.stringify(entry)}</div>)
  }

  displayJob = (job) => {
    if (job) {
      return (
        <div>
          <Link to="/createjob">
            <button>Edit</button>
          </Link>
          <button>Unpublish</button>
          <button>Delete</button>
          [Job] {JSON.stringify(job)}
        </div>) 
    }
    
  }
  

  render() {
    const params = getUrlParams(this);
    

    return (<div>
      <Navbar searchType={"this.searchType"}></Navbar>
      <h2>Jobs</h2>
      <Link to="/createjob">
        <button>+</button>
      </Link>
      <Sidebar entries={this.state.jobs} displayPreview={this.displayPreview} onSelect={this.displaySelection}></Sidebar>
      { 
        this.displayJob(this.state.jobs[this.state.currSelectedIndex])
      } 
    </div>)
  }
}
