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
      viewUserInfo: null,
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
        { userID: user.sub, category: "job", favoritee_id: this.props.id }
      )).is_favorite
    }

    const viewUserInfo = await makeBackendRequest(
      '/api/user_info',
      { userID: this.props.id }
    )

    console.log('favorite?')
    console.log(isFavorited)

    if (this.mounted) {
      this.setState({
        currUserInfo: currUserInfo,
        viewUserInfo: viewUserInfo,
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

  createFavoritesButtons = () => {
    const { isAuthenticated } = this.props.auth0;

    if (isAuthenticated) {
      return (<div>
        <Link to="/favorites">
          <button>Favorites</button>
        </Link>
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
      category: this.props.category,
      favoritee_id: this.state.viewUserInfo.auth0_user_id,
      favorite_status: !this.state.isFavorited,
      access_token: await getAccessTokenSilently()
    })

    const isFavorited = (await makeBackendRequest('/api/is_favorite', {
      userID: user.sub,
      category: this.props.category,
      favoritee_id: this.props.id
    })).is_favorite

    this.setState({
      isFavorited: isFavorited
    })
  }

  showProfile() {
    return (

      <div id="profile">
        <div className="job">
          <h2>{this.viewUserInfo.name}</h2>

          <img src={this.viewUserInfo.job_image_url} id="job-image" alt="Job Image" />

          <Link to={"/profile/" + this.viewUserInfo.username}>
            <button>Profile</button>
          </Link>

          <a href={`mailto:${this.viewUserInfo.email}`}>
            <button>Contact</button>
          </a>

          {this.createFavoritesButtons()}

          <h3>Description: </h3>
          <p>{this.viewUserInfo.description}</p>

          <h3>Qualifications: </h3>
          <p>{this.viewUserInfo.qualifications}</p>

          <h3>Logistics: </h3>
          <p>{this.viewUserInfo.logistics}</p>

        </div>

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

    if (!this.state.viewUserInfo) {
      return (<div>Error: please try again.</div>);
    }

    return this.showProfile()
  }
}

export default withAuth0(JobView);
