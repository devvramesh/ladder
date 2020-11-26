import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util";
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/StarBorder';
import { withAuth0 } from "@auth0/auth0-react";

class EditableEmployerProfile extends React.Component {
  constructor(props) {
    super(props);

    console.log('EDIT employer profile')

    this.state = {
      userInfo: null,
      ready: false
    }

    this.name = React.createRef();
    this.profile_img_url = React.createRef();
    this.about = React.createRef();
    this.logistics = React.createRef();
    this.phone = React.createRef();
    this.location = React.createRef();
  }

  loadUserInfo = async () => {
    const { user, isLoading } = this.props.auth0;

    let userInfo = null;
    if (user) {
      userInfo = await makeBackendRequest(
        '/api/user_info',
        { userID: user.sub }
      )
    }

    console.log(userInfo)

    if (this.mounted) {
      console.log('setting state!')
      this.setState({
        userInfo: userInfo,
        ready: !isLoading
      })
    }
  }

  async componentDidMount() {
    console.log('didMount')
    this.mounted = true;
    await this.loadUserInfo();
  }

  componentWillUnmount() {
    console.log('unmount')
    this.mounted = false;
  }

  save = async () => {
    const { user } = this.props.auth0;
    await makeBackendRequest('/api/update_profile', {
      // uneditable fields: use existing values
      userID: user.sub,
      email: user.email,
      username: this.state.userInfo.username,
      account_type: 'employer',

      // editable fields: use text input values
      name: this.name.current.value,
      profile_img_url: this.profile_img_url.current.value,
      about: this.about.current.value,
      logistics: this.logistics.current.value,
      phone: this.phone.current.value,
      location: this.location.current.value
    })
  }

  saveExit = async () => {
    await this.save()
    window.location.href = "/profile"
  }

  render() {
    if (!this.state.userInfo) {
      this.loadUserInfo();
      return null;
    }

    if (!this.state.ready) {
      return null;
    }

    return (<div>
      <Navbar searchType={this.searchType}></Navbar>
      <div>
        <label htmlFor="name">Name:</label>
        <textarea name="name" ref={this.name} defaultValue={this.state.userInfo.name}></textarea>
      </div>

      <div>
        <label htmlFor="profile_img_url">Profile Image URL:</label>
        <textarea name="profile_img_url" ref={this.profile_img_url} defaultValue={this.state.userInfo.profile_img_url}></textarea>
      </div>

      <div>
        <label htmlFor="about">About:</label>
        <textarea name="about" ref={this.about} defaultValue={this.state.userInfo.about}></textarea>
      </div>

      <div>
        <label htmlFor="logistics">Logistics:</label>
        <textarea name="logistics" ref={this.logistics} defaultValue={this.state.userInfo.logistics}></textarea>
      </div>

      <div>
        <label htmlFor="phone">Phone:</label>
        <textarea name="phone" ref={this.phone} defaultValue={this.state.userInfo.phone}></textarea>
      </div>

      <div>
        <label htmlFor="location">Location:</label>
        <textarea name="location" ref={this.location} defaultValue={this.state.userInfo.location}></textarea>
      </div>

      <div>
        <button onClick={this.save}>Save & Continue Editing</button>
        <button onClick={this.saveExit}>Save & Exit</button>
        <Link to="/profile">
          <button>Cancel</button>
        </Link>
      </div>

    </div>)
  }
}

export default withAuth0(EditableEmployerProfile);
