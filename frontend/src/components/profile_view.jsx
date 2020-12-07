import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import { Link, Redirect, withRouter } from "react-router-dom";
import { makeBackendRequest, getUrlParams, } from "../util";
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { withAuth0 } from "@auth0/auth0-react";

class ProfileView extends React.Component {
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
        { userID: user.sub, category: this.props.category, favoritee_id: this.props.id }
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

  createEditButton = () => {
    console.log('edit?')
    console.log(this.props.editable)
    if (this.props.editable) {
      return (<Link to="/edit_profile">
        <button>Edit</button>
      </Link>)
    }

    return (<div></div>)
  }

  createFavoritesButtons = () => {
    const { isAuthenticated } = this.props.auth0;

    if (isAuthenticated) {
      return (<div>
        <IconButton className="favorite-button" aria-label="Star" onClick={this.toggleFavorite}>
          {this.state.isFavorited ? (<StarIcon />) : (<StarBorderIcon />)}
        </IconButton>
        { this.props.editable ?
          (<Link to="/favorites">
            <button>Favorites</button>
          </Link>) : (<div></div>) }
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

    if (!isFavorited && this.props.deleteFromSidebar) {
      this.props.deleteFromSidebar()
    }
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

    return this.props.showProfile(this)
  }
}

export default withAuth0(ProfileView);
