import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import { Link, Redirect, withRouter } from "react-router-dom";
import { makeBackendRequest, getUrlParams, } from "../util";
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { withAuth0 } from "@auth0/auth0-react";

class JobView extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      currUserInfo: null,
      viewJobInfo: null,
      jobCompanyInfo: null,
      isFavorited: false,
      ready: false
    }
  }

  load = async () => {
    const { user, isLoading } = this.props.auth0;

    if (isLoading) {
      setTimeout(this.load, 100)
      return;
    }

    if (this.state.ready) {
      return;
    }

    let currUserInfo = null;
    let isFavorited = false;
    if (user) {
      currUserInfo = await makeBackendRequest(
        '/api/user_info',
        { userID: user.sub }
      )

      isFavorited = (await makeBackendRequest(
        '/api/is_favorite',
        { userID: user.sub, category: "job", favoritee_id: this.props.job_id }
      )).is_favorite
    }

    const viewJobInfo = await makeBackendRequest(
      '/api/job_info',
      { job_id: this.props.job_id }
    )
    const jobCompanyInfo = await makeBackendRequest(
      '/api/user_info',
      { userID: viewJobInfo.auth0_user_id }
    )

    console.log('favorite?')
    console.log(isFavorited)

    if (this.mounted) {
      this.setState({
        currUserInfo: currUserInfo,
        viewJobInfo: viewJobInfo,
        jobCompanyInfo: jobCompanyInfo,
        isFavorited: isFavorited,
        ready: !isLoading
      })
    }
  }

  async componentDidMount() {
    console.log('didMount')
    this.mounted = true;
    await this.load();
  }

  componentWillUnmount() {
    console.log('unmount')
    this.mounted = false;
  }

  createProfileButton = () => {
    const { user, getAccessTokenSilently } = this.props.auth0;
    let link_addition = ""
    if (user.sub !== this.state.viewJobInfo.auth0_user_id) {
      link_addition = this.state.jobCompanyInfo.username
    }

    return (
      <Link to={"/profile/" + link_addition}>
        <button>Profile</button>
      </Link>
    )
  }

  createFavoritesButton = () => {
    const { isAuthenticated } = this.props.auth0;

    if (isAuthenticated) {
      return (<div>
        <IconButton aria-label="Star" onClick={this.toggleFavorite}>
          {this.state.isFavorited ? (<StarIcon />) : (<StarBorderIcon />)}
        </IconButton>
      </div>
      )
    } else {
      return (<div></div>)
    }
  }

  toggleFavorite = async () => {
    const { user, getAccessTokenSilently } = this.props.auth0;

    await makeBackendRequest('/api/update_favorite', {
      userID: user.sub,
      category: "job",
      favoritee_id: this.state.viewJobInfo.job_id,
      favorite_status: !this.state.isFavorited,
      access_token: await getAccessTokenSilently()
    })

    const isFavorited = (await makeBackendRequest('/api/is_favorite', {
      userID: user.sub,
      category: "job",
      favoritee_id: this.state.viewJobInfo.job_id
    })).is_favorite

    this.setState({
      isFavorited: isFavorited
    })
  }

  showProfile() {
    return (

      <div id="profile">
        <h2>{this.state.jobCompanyInfo.name + ": " + this.state.viewJobInfo.job_title}</h2>

        <img src={this.state.viewJobInfo.job_image_url} style={{ height: "200px" }} id="job-image" alt="Job Image" />

        {this.createProfileButton()}

        <a href={`mailto:${this.state.viewJobInfo.email}`}>
          <button>Contact</button>
        </a>

        {this.createFavoritesButton()}

        <h3>Description: </h3>
        <p>{this.state.viewJobInfo.description}</p>

        <h3>Qualifications: </h3>
        <p>{this.state.viewJobInfo.qualifications}</p>

        <h3>Logistics: </h3>
        <p>{this.state.viewJobInfo.logistics}</p>


      </div>
    )
  }


  render() {
    const { isAuthenticated } = this.props.auth0;

    if (!this.state.ready) {
      return (<div>Loading...</div>);
    }

    if (isAuthenticated && !this.state.currUserInfo && !this.state.currUserInfo.account_type) {
      return (<div>Error: please try again.</div>);
    }

    if (!this.state.viewJobInfo) {
      return (<div>Error: please try again.</div>);
    }
    return this.showProfile()
  }
}

export default withAuth0(JobView);
