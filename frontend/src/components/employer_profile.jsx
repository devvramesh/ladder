import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util";
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/StarBorder';

export default class EmployerProfile extends React.Component {
  constructor(props) {
    super(props);

    console.log("VIEWING EMPLOYER PROFILE " + this.props.id)

    this.state = {
      userInfo: null,
      ready: false
    }

    this.SAMPLE = {
      name: "Construction Company",
      image_src: "https://images.template.net/wp-content/uploads/2015/04/Stylized-Construction-Company-Logo.jpg",
      contact: "",
      website: "",
      about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices a leo eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam volutpat scelerisque enim, convallis vulputate ipsum dapibus vulputate. Etiam vel molestie quam. Proin quis lacus et dui pulvinar aliquam non id odio.",
      logistics: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices a leo eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam volutpat scelerisque enim, convallis vulputate ipsum dapibus vulputate. Etiam vel molestie quam. Proin quis lacus et dui pulvinar aliquam non id odio.",
      location: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices a leo eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam volutpat scelerisque enim, convallis vulputate ipsum dapibus vulputate. Etiam vel molestie quam. Proin quis lacus et dui pulvinar aliquam non id odio."
    }
  }

  loadUserInfo = async () => {
    const userInfo = await makeBackendRequest(
      '/api/user_info',
      { userID: this.props.id }
    )

    if (this.mounted) {
      this.setState({
        userInfo: userInfo,
        ready: true
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

  render() {
    if (!this.state.userInfo) {
      this.loadUserInfo();
      return null;
    }

    if (!this.state.ready) {
      return null;
    }

    console.log(this.state.userInfo)

    return (<div>
      <Navbar searchType={this.searchType}></Navbar>
      <h2>{this.state.userInfo.name}</h2>

      <img src={this.state.userInfo.profile_img_url} id="profile-image" alt="Profile Image"/>

      {this.createEditButton()}
      <Link to="/favorites">
            <button>Favorites</button>
      </Link>
      <Link to="/jobs">
            <button>Jobs</button>
      </Link>
      <button>Website</button>
        <a href={`mailto:${this.state.userInfo.email}`}>
          <button>Contact</button>
        </a>
      <IconButton aria-label="Star">
        <StarIcon />
      </IconButton>


      <h3>About: </h3>
      <p>{this.state.userInfo.about}</p>

      <h3>Logistics: </h3>
      <p>{this.state.userInfo.logistics}</p>

      <h3>Location: </h3>
      <p>{this.state.userInfo.location}</p>


    </div>)
  }
}
