import React from "react";
import Navbar from "./navbar"
import ProfileView from "./profile_view"
import {Link} from "react-router-dom";
import { withAuth0 } from "@auth0/auth0-react";

class EmployerProfile extends React.Component {
  render() {
    return (<ProfileView showProfile={this.showProfile} {...this.props} category="company"></ProfileView>)
  }

  showProfile(ref) {
    return (<div>
      <Navbar searchType={ref.searchType}></Navbar>
      <h2>{ref.state.viewUserInfo.name}</h2>

      <img src={ref.state.viewUserInfo.profile_img_url} id="profile-image" alt="Profile Image"/>

        {ref.createEditButton()}
        {ref.createFavoritesButtons()}
      <Link to="/jobs">
            <button>Jobs</button>
      </Link>
      <Link to={ref.state.websiteURL}>
        <button>Website</button>
      </Link>
      <a href={`mailto:${ref.state.viewUserInfo.email}`}>
        <button>Contact</button>
      </a>


      <h3>About: </h3>
      <p>{ref.state.viewUserInfo.about}</p>

      <h3>Logistics: </h3>
      <p>{ref.state.viewUserInfo.logistics}</p>

      <h3>Location: </h3>
      <p>{ref.state.viewUserInfo.location}</p>


    </div>)
  }
}

export default withAuth0(EmployerProfile)
