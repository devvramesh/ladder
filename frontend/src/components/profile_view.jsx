import React from "react";
import { Link } from "react-router-dom";
import { makeBackendRequest } from "../util";
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
    this.mounted = true;
    await this.load();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  createEditButton = () => {
    if (this.props.editable) {
      return (<Link to="/edit_profile">
        <button>Edit</button>
      </Link>)
    }

    return (<div></div>)
  }

  createFavoritesButtons = () => {
    const { isAuthenticated } = this.props.auth0;

    const starButton = (isAuthenticated) ?
    (
      <IconButton className="favorite-button" aria-label="Star" onClick={this.toggleFavorite}>
        {this.state.isFavorited ?
          (<StarIcon />) : (<StarBorderIcon />)}
      </IconButton>
    )
      :
      (<div></div>)

    const favoritesLinkButton = (isAuthenticated && this.props.editable) ?
    (
      <Link to="/favorites">
      <button>Favorites</button>
      </Link>
    )
    : (<div></div>)

    return (<div>{starButton}{favoritesLinkButton}</div>)
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
