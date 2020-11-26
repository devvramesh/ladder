import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import {Link, Redirect, withRouter} from "react-router-dom";
import {makeBackendRequest, getUrlParams,} from "../util";
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/StarBorder';

export default class EmployeeProfile extends React.Component {
  constructor(props) {
    super(props);

    console.log("VIEWING EMPLOYEE PROFILE " + this.props.id)

    this.state = {
      name: "",
      category: "",
      image_src: "",
      contact: "",
      about: "",
      qualifications: "",
      looking_for: ""
    }

    this.state = {
      name: "Joe Smith",
      category: "Construction",
      image_src: "http://2.bp.blogspot.com/-HFrhsfrn1jk/UKTQSzXjJ-I/AAAAAAAAAJA/965wLNZUFkQ/s1600/profile+picture.jpg",
      contact: "",
      about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices a leo eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam volutpat scelerisque enim, convallis vulputate ipsum dapibus vulputate. Etiam vel molestie quam. Proin quis lacus et dui pulvinar aliquam non id odio.",
      qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices a leo eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam volutpat scelerisque enim, convallis vulputate ipsum dapibus vulputate. Etiam vel molestie quam. Proin quis lacus et dui pulvinar aliquam non id odio.",
      looking_for: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices a leo eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam volutpat scelerisque enim, convallis vulputate ipsum dapibus vulputate. Etiam vel molestie quam. Proin quis lacus et dui pulvinar aliquam non id odio."
    }
  }

  createEditButton = () => {
    if (this.props.editable) {
      return (<button>Edit</button>)
    }

    return (<div></div>)
  }

  render() {

    return (<div>
      <Navbar searchType={this.searchType}></Navbar>
      <h2>{this.state.name}</h2>
      <h3>{this.state.category}</h3>

      <img src={this.state.image_src} id="profile-image" alt="Profile Image"/>

      {this.createEditButton()}
      <Link to="/favorites">
            <button>Favorites</button>
      </Link>
      <button>Contact</button>
      <IconButton aria-label="Star">
        <StarIcon />
      </IconButton>


      <h3>About: </h3>
      <p>{this.state.about}</p>

      <h3>Qualifications: </h3>
      <p>{this.state.qualifications}</p>

      <h3>Looking For: </h3>
      <p>{this.state.looking_for}</p>


    </div>)
  }
}
