import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util";
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/StarBorder';
import { withAuth0 } from "@auth0/auth0-react";

class EmployeeProfile extends React.Component {
  constructor(props) {
    super(props);

    console.log('view employee profile')

    this.state = {
      userInfo: null,
      ready: false
    }

    this.SAMPLE = {
      name: "Joe Smith",
      category: "Construction",
      image_src: "http://2.bp.blogspot.com/-HFrhsfrn1jk/UKTQSzXjJ-I/AAAAAAAAAJA/965wLNZUFkQ/s1600/profile+picture.jpg",
      contact: "",
      about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices a leo eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam volutpat scelerisque enim, convallis vulputate ipsum dapibus vulputate. Etiam vel molestie quam. Proin quis lacus et dui pulvinar aliquam non id odio.",
      qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices a leo eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam volutpat scelerisque enim, convallis vulputate ipsum dapibus vulputate. Etiam vel molestie quam. Proin quis lacus et dui pulvinar aliquam non id odio.",
      looking_for: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices a leo eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam volutpat scelerisque enim, convallis vulputate ipsum dapibus vulputate. Etiam vel molestie quam. Proin quis lacus et dui pulvinar aliquam non id odio."
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

    return (<div>
      <Navbar searchType={this.searchType}></Navbar>
      <h2>{this.state.userInfo.name}</h2>
      <h3>{this.state.userInfo.category}</h3>

      <img src={this.state.userInfo.profile_img_url} id="profile-image" alt="Profile Image"/>

      {this.createEditButton()}
      <Link to="/favorites">
            <button>Favorites</button>
      </Link>
      <a href={`mailto:${this.state.userInfo.email}`}>
        <button>Contact</button>
      </a>
      <IconButton aria-label="Star">
        <StarIcon />
      </IconButton>


      <h3>About: </h3>
      <p>{this.state.userInfo.about}</p>

      <h3>Qualifications: </h3>
      <p>{this.state.userInfo.qualifications}</p>

      <h3>Looking For: </h3>
      <p>{this.state.userInfo.looking_for}</p>


    </div>)
  }
}

export default withAuth0(EmployeeProfile);
