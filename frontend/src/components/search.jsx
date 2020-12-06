import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import EmployeeProfile from "./employee_profile"
import { Link, Redirect, withRouter } from "react-router-dom";
import { makeBackendRequest, getUrlParams, } from "../util"
import JobView from "./job_view"
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';


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
      this.setState({ searchResults: result, ready: true });
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
    if (this.searchType === "employee") {
      return (<EmployeeProfile key={entry.auth0_user_id} id={entry.auth0_user_id} editable={false}></EmployeeProfile>)
    } else if (this.searchType === "job") {
<<<<<<< HEAD
      return (<JobView key={entry.auth0_user_id} job_id={entry.job_id}></JobView>)
=======
      return (<div className="job">
        <h2>{entry.name}</h2>

        <img src={entry.job_image_url} id="job-image" alt="Job Image" />

        <Link to={"/profile/" + (entry.auth0_user_id === entry.username ? entry.username : entry.username )}>
          <button>Profile</button>
        </Link>

        <a href={`mailto:${entry.email}`}>
          <button>Contact</button>
        </a>

        <IconButton aria-label="Star" onClick={this.toggleFavorite}>
          {false ? (<StarIcon />) : (<StarBorderIcon />)}
        </IconButton>

        <h3>Description: </h3>
        <p>{entry.description}</p>

        <h3>Qualifications: </h3>
        <p>{entry.qualifications}</p>

        <h3>Logistics: </h3>
        <p>{entry.logistics}</p>

      </div>)
      //       <JobView key={entry.auth0_user_id} id={entry.auth0_user_id}></JobView>*/
>>>>>>> 83ce109cd9b192d7d1fdc6b6f0709a62be089f61
    } else {
      return null;
    }
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
      <Sidebar entries={this.state.searchResults} displayPreview={this.displayPreview} displayEntry={this.displayEntry}
        ifEmpty={<div>No results.</div>}></Sidebar>
    </div>)
  }
}
