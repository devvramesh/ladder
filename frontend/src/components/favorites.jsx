import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util"

export default class Favorites extends React.Component {
  constructor(props) {
    super(props);

    const params = getUrlParams(this);
    let searchType = params.category;
    if (searchType) {
      searchType = searchType.toLowerCase();
      if (searchType !== "employee" && searchType !== "job" && searchType !== "company") {
        searchType = "invalid";
      }
    } else {
      searchType = "invalid"
    }

    this.searchType = searchType;
    this.isValid = (searchType !== "invalid")

    if (!this.isValid) {
      window.location.href = ('/favorites?category=job');
    }

    this.state = {
      currSelectedIndex: 0,
      favorites: []
    }
  }

  componentDidMount() {
    // get URL params (i.e. /search?query=roofer) --> {query: "roofer"}
    const params = getUrlParams(this);
    params["category"] = this.searchType;

    makeBackendRequest('/api/favorites', params).then((result) => {
      console.log('fetched')
      console.log(result)
      this.setState({favorites: result.favorites});
    })
  }

  displaySelection = (index) => {
    this.setState({currSelectedIndex: index})
  }

  displayPreview = (entry) => {
    return (<div>[Sidebar entry] {JSON.stringify(entry)}</div>)
  }

  switchType = (event) => {
    const category = event.target.value;
    window.location.href = `/favorites?category=${category}`;
  }

  render() {
    console.log('rendering')
    const params = getUrlParams(this);

    if (!this.isValid) {
      return (<div>Invalid search</div>)
    }
    console.log('rendering valid')
    console.log(this.state)
    return (<div>
      <Navbar searchType={this.searchType} initialSearchBarText={params.query}></Navbar>
      <h2>Favorites</h2>
      <label for="favoritesType">Favorites category:</label>
        <select name="favoritesType" id="favoritesType" onChange={this.switchType} value={this.searchType}>
          <option value="employee">employee</option>
          <option value="job">job</option>
          <option value="company">company</option>
        </select>
      <Sidebar entries={this.state.favorites} displayPreview={this.displayPreview} onSelect={this.displaySelection}></Sidebar>
      <div className="border">[Current selected index: {this.state.currSelectedIndex}] Item: {JSON.stringify(this.state.favorites[this.state.currSelectedIndex])}</div>
    </div>)
  }
}
