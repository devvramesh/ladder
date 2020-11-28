import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util";
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/StarBorder';
import { withAuth0 } from "@auth0/auth0-react";

class EditableEmployeeProfile extends React.Component {
  constructor(props) {
    super(props);

    console.log('edit employee profile')

    this.state = {
      userInfo: null,
      ready: false
    }

    this.name = React.createRef();
    this.category = React.createRef();
    this.profile_img_url = React.createRef();
    this.about = React.createRef();
    this.qualifications = React.createRef();
    this.looking_for = React.createRef();
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
    await this.load();
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
      account_type: 'employee',

      // editable fields: use text input values
      name: this.name.current.value,
      category: this.category.current.value,
      profile_img_url: this.profile_img_url.current.value,
      about: this.about.current.value,
      qualifications: this.qualifications.current.value,
      looking_for: this.looking_for.current.value,
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

    if (isAuthenticated && !this.state.userInfo && !this.state.userInfo.account_type) {
      return (<div>Error: please try again.</div>);
    }

    if (!isAuthenticated) {
      return (<div>Error: must be logged in to edit your profile.</div>)
    }

    return (<div>
      <Navbar searchType={this.searchType}></Navbar>
      <div>
        <label htmlFor="name">Name:</label>
        <textarea name="name" ref={this.name} defaultValue={this.state.userInfo.name}></textarea>
      </div>

      <div>
        <label htmlFor="category">Category: (should this eventually be a dropdown?)</label>
        <textarea name="category" ref={this.category} defaultValue={this.state.userInfo.category}></textarea>
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
        <label htmlFor="qualifications">Qualifications:</label>
        <textarea name="qualifications" ref={this.qualifications} defaultValue={this.state.userInfo.qualifications}></textarea>
      </div>

      <div>
        <label htmlFor="looking_for">Looking For:</label>
        <textarea name="looking_for" ref={this.looking_for} defaultValue={this.state.userInfo.looking_for}></textarea>
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

export default withAuth0(EditableEmployeeProfile);
