import React from "react";
import { Link } from "react-router-dom";
import { makeBackendRequest } from "../util";
import { withAuth0 } from "@auth0/auth0-react";
import "./editprofile.css"

class EditableEmployerProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: null,
      ready: false
    }

    this.name = React.createRef();
    this.profile_img_url = React.createRef();
    this.about = React.createRef();
    this.logistics = React.createRef();
    this.website_url = React.createRef();
    this.phone = React.createRef();
    this.location = React.createRef();
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

    let userInfo = null;
    if (user) {
      userInfo = await makeBackendRequest(
        '/api/user_info',
        { userID: user.sub }
      )
    }

    if (this.mounted) {
      this.setState({
        userInfo: userInfo,
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

  save = async () => {
    const { user, getAccessTokenSilently } = this.props.auth0;
    await makeBackendRequest('/api/update_profile', {
      // uneditable fields: use existing values
      userID: user.sub,
      email: user.email,
      username: this.state.userInfo.username,
      account_type: 'employee',
      access_token: await getAccessTokenSilently(),

      // editable fields: use text input values
      name: this.name.current.value,
      profile_img_url: this.profile_img_url.current.value,
      about: this.about.current.value,
      logistics: this.logistics.current.value,
      website_url: this.website_url.current.value,
      phone: this.phone.current.value,
      location: this.location.current.value
    })
  }

  saveExit = async () => {
    await this.save()
    window.location.href = "/profile"
  }

  render() {
    const { isAuthenticated } = this.props.auth0;

    if (!this.state.ready) {
      return (<div>Loading...</div>);
    }

    if (isAuthenticated && (!this.state.userInfo || !this.state.userInfo.account_type)) {
      return (<div>Error: please try again.</div>);
    }

    if (!isAuthenticated) {
      return (<div>Error: must be logged in to edit your profile.</div>)
    }

    return (<div id="edit-profile" className="column">

      <div className="edit-profile-section">
        <label htmlFor="name">Name</label>
        <div className="separator"></div>
        <input name="name" placeholder="Name" ref={this.name} defaultValue={this.state.userInfo.name} />
      </div>

      <div className="edit-profile-section">
        <label htmlFor="profile_img_url">Profile Image URL</label>
        <div className="separator"></div>
        <input name="profile_img_url" placeholder="Profile Image URL" ref={this.profile_img_url} defaultValue={this.state.userInfo.profile_img_url} />
      </div>

      <div className="edit-profile-section">
        <label htmlFor="about">About</label>
        <div name="about" className="separator"></div>
        <textarea placeholder="About" ref={this.about} defaultValue={this.state.userInfo.about} />
      </div>

      <div className="edit-profile-section">
        <label htmlFor="logistics">Logistics</label>
        <div className="separator"></div>
        <textarea name="logistics" placeholder="Logistics" ref={this.logistics} defaultValue={this.state.userInfo.logistics} />
      </div>

      <div className="edit-profile-section">
        <label htmlFor="website_url">Company Website URL</label>
        <div className="separator"></div>
        <input name="website_url" placeholder="Company Website URL" ref={this.website_url} defaultValue={this.state.userInfo.website_url} />
      </div>

      <div className="edit-profile-section">
        <label htmlFor="phone">Phone</label>
        <div className="separator"></div>
        <input name="phone" placeholder="Phone" ref={this.phone} defaultValue={this.state.userInfo.phone} />
      </div>

      <div className="edit-profile-section">
        <label htmlFor="location">Location</label>
        <div className="separator"></div>
        <input name="location" placeholder="Location" ref={this.location} defaultValue={this.state.userInfo.location} />
      </div>

      <div className="row" id="edit-profile-save">
        <button onClick={this.save} >Save & Continue Editing</button>
        <button onClick={this.saveExit} >Save & Exit</button>
      </div>
      <div className="row">
        <Link to="/profile" id="edit-profile-link-cancel">
          <button id="edit-profile-cancel">Cancel</button>
        </Link>
      </div>
    </div>)
  }
}

export default withAuth0(EditableEmployerProfile);
