import React from "react";
import ProfileView from "./profile_view"

export default class EmployeeProfile extends React.Component {
  render () {
    return <ProfileView showProfile={this.showProfile} {...this.props} category="employee"></ProfileView>
  }

  showProfile(ref) {
    // ref is "this". it handles all authentication, then
    // renders based on this if everything looks right. i did this bc
    // the auth code became very repetitive for this and EmployerProfile.
    // let me know if you want me to change it back though i definitely
    // wouldnt mind. -jake
    return (
      <div id="profile">
          <div id="top-section">
              <h2>{ref.state.viewUserInfo.name}</h2>
              <h3>{ref.state.viewUserInfo.category}</h3>

              <img src={ref.state.viewUserInfo.profile_img_url} id="profile-image" alt="Profile Image"/>

              {ref.createEditButton()}
              {ref.createFavoritesButtons()}
              <a href={`mailto:${ref.state.viewUserInfo.email}`}>
                <button>Contact</button>
              </a>
          </div>

          <div id="bottom-section">
              <table>
                <tbody>
                  <tr>
                      <td><h3>About: </h3></td>
                      <td><p>{ref.state.viewUserInfo.about}</p></td>
                  </tr>
                  <tr>
                       <td><h3>Qualifications: </h3></td>
                       <td><p>{ref.state.viewUserInfo.qualifications}</p></td>
                  </tr>
                  <tr>
                       <td><h3>Looking For: </h3></td>
                       <td><p>{ref.state.viewUserInfo.looking_for}</p></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
    )
  }
}
