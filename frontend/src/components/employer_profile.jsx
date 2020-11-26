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
      name: "",
      image_src: "",
      contact: "",
      website: "",
      about: "",
      logistics: "",
      location: ""
    }

    this.state = {
      name: "Construction Company",
      image_src: "https://images.template.net/wp-content/uploads/2015/04/Stylized-Construction-Company-Logo.jpg",
      contact: "",
      website: "",
      about: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices a leo eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam volutpat scelerisque enim, convallis vulputate ipsum dapibus vulputate. Etiam vel molestie quam. Proin quis lacus et dui pulvinar aliquam non id odio.",
      logistics: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices a leo eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam volutpat scelerisque enim, convallis vulputate ipsum dapibus vulputate. Etiam vel molestie quam. Proin quis lacus et dui pulvinar aliquam non id odio.",
      location: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ultrices a leo eget blandit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam volutpat scelerisque enim, convallis vulputate ipsum dapibus vulputate. Etiam vel molestie quam. Proin quis lacus et dui pulvinar aliquam non id odio."
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
      <Link to="/jobs">
            <button>Jobs</button>
      </Link>
      <button>Website</button>
      <button>Contact</button>
      <IconButton aria-label="Star">
        <StarIcon />
      </IconButton>


      <h3>About: </h3>
      <p>{this.state.about}</p>

      <h3>Logistics: </h3>
      <p>{this.state.logistics}</p>

      <h3>Location: </h3>
      <p>{this.state.location}</p>


    </div>)
  }
}
