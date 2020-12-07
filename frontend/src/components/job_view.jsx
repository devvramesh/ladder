import React from "react";
import Navbar from "./navbar"
import Sidebar from "./sidebar"
import { Link, Redirect, withRouter } from "react-router-dom";
import { makeBackendRequest, getUrlParams, } from "../util";
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { withAuth0 } from "@auth0/auth0-react";

class JobView extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      currUserInfo: null,
      viewJobInfo: null,
      jobCompanyInfo: null,
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
        { userID: user.sub, category: "job", favoritee_id: this.props.job_id }
      )).is_favorite
    }

    const viewJobInfo = await makeBackendRequest(
      '/api/job_info',
      { job_id: this.props.job_id }
    )
    const jobCompanyInfo = await makeBackendRequest(
      '/api/user_info',
      { userID: viewJobInfo.auth0_user_id }
    )

    console.log('favorite?')
    console.log(isFavorited)

    if (this.mounted) {
      this.setState({
        currUserInfo: currUserInfo,
        viewJobInfo: viewJobInfo,
        jobCompanyInfo: jobCompanyInfo,
        isFavorited: isFavorited,
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

  createProfileButton = () => {
    if (!this.props.editable) {
      const { user, isAuthenticated } = this.props.auth0;
      let link_addition = ""
      if (!isAuthenticated || user.sub !== this.state.viewJobInfo.auth0_user_id) {
        link_addition = this.state.jobCompanyInfo.username
      }

      return (
        <Link to={"/profile/" + link_addition}>
          <button>Profile</button>
        </Link>
      )
    } else {
      return (<div></div>)
    }

  }

  createFavoritesButton = () => {
    const { isAuthenticated } = this.props.auth0;

    if (isAuthenticated && !this.props.editable) {
      return (<div>
        <IconButton aria-label="Star" onClick={this.toggleFavorite}>
          {this.state.isFavorited ? (<StarIcon />) : (<StarBorderIcon />)}
        </IconButton>
      </div>
      )
    } else {
      return (<div></div>)
    }
  }

  toggleFavorite = async () => {
    const { user, getAccessTokenSilently } = this.props.auth0;

    await makeBackendRequest('/api/update_favorite', {
      userID: user.sub,
      category: "job",
      favoritee_id: this.state.viewJobInfo.job_id,
      favorite_status: !this.state.isFavorited,
      access_token: await getAccessTokenSilently()
    })

    const isFavorited = (await makeBackendRequest('/api/is_favorite', {
      userID: user.sub,
      category: "job",
      favoritee_id: this.state.viewJobInfo.job_id
    })).is_favorite

    this.setState({
      isFavorited: isFavorited
    })
  }

  getJobs = async () => {
    const { user } = this.props.auth0;
    let jobs = []

    if (user) {
      jobs = await makeBackendRequest(
        '/api/get_jobs',
        { userID: user.sub, published: false }
      )
    }

    console.log('got jobs:')
    console.log(jobs)
    return jobs
  }

  setPublished = async (job, publish) => {
    const { getAccessTokenSilently } = this.props.auth0;

    let body = job;
    body.published = publish
    body.access_token = await getAccessTokenSilently()

    await makeBackendRequest('/api/update_job', body)
    const jobs = await this.getJobs()
    this.setState({
      jobs: jobs
    })
  }

  deleteJob = async (job_id) => {
    const { user, getAccessTokenSilently } = this.props.auth0;

    await makeBackendRequest('/api/delete_job', {
      userID: user.sub,
      job_id: job_id,
      access_token: await getAccessTokenSilently()
    })
    const jobs = await this.getJobs()
    console.log('job just deleted. setting state')
    console.log(jobs)
    this.setState({
      jobs: jobs
    })
  }

  showProfile() {
    let publishButton = <div></div>
    if (this.props.editable) {
      if (this.state.viewJobInfo.published) {
        publishButton = (<button onClick={() => this.setPublished(this.state.viewJobInfo, false)}>Unpublish</button>)
      } else {
        publishButton = (<button onClick={() => this.setPublished(this.state.viewJobInfo, true)}>Publish</button>)
      }
    }


    return (

      <div className="column" id="profile-main">
        <div id="profile">
          <div id="top-section">
            {
              this.props.editable ? <div>
                <Link to={`/edit_job/${this.state.viewJobInfo.job_id}`}>
                  <button>Edit</button>
                </Link>
                {publishButton}
                <button onClick={() => {
                  this.deleteJob(this.state.viewJobInfo.job_id);
                  this.props.delete()
                }}>
                  Delete</button>

              </div> : <div></div>

            }

            <h2>{this.state.jobCompanyInfo.name + ": " + this.state.viewJobInfo.job_title}</h2>

            {
              this.state.viewJobInfo.job_image_url === null ?
              <img src={this.state.jobCompanyInfo.profile_img_url} id="profile-image" alt="Job Image"/> :
              <img src={this.state.viewJobInfo.job_image_url} id="profile-image" alt="Job Image"/>
            }

            {this.createProfileButton()}

            <a href={`mailto:${this.state.viewJobInfo.email}`}>
              <button>Contact</button>
            </a>

            {this.createFavoritesButton()}
          </div>
          <div id="bottom-section">

            <h3>Description: </h3>
            <p>{this.state.viewJobInfo.description}</p>

            <h3>Qualifications: </h3>
            <p>{this.state.viewJobInfo.qualifications}</p>

            <h3>Logistics: </h3>
            <p>{this.state.viewJobInfo.logistics}</p>
          </div>
        </div>
      </div>
    )
  }


  render() {
    const { isAuthenticated } = this.props.auth0;

    console.log('job view render')

    if (!this.state.ready) {
      return (<div>Loading...</div>);
    }

    if (isAuthenticated && !this.state.currUserInfo && !this.state.currUserInfo.account_type) {
      return (<div>Error: please try again.</div>);
    }

    if (!this.state.viewJobInfo) {
      return (<div>Error: please try again.</div>);
    }
    return this.showProfile()
  }
}

export default withAuth0(JobView);
