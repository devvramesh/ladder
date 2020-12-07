import './App.css';

import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";

import Home from './components/homepage';
import Search from './components/search';
import Favorites from './components/favorites';
import CreateJob from './components/createjob';
import Profile from './components/profile'
import EditProfile from './components/edit_profile'
import EditJobs from './components/edit_jobs';
import ViewJobs from './components/view_jobs'

const RedirectToHomepage = () => {
  window.location.href = window.location.origin;
  return null;
}

const Main = () => {
  return (<Switch>
    {/* The Switch decides which component to show based on the current URL. */}
    <Route exact path='/' component={Home}></Route>
    <Route exact path='/search' component={Search}></Route>
    <Route exact path='/favorites' component={Favorites}></Route>
    <Route exact path='/create_job' component={CreateJob}></Route>
    <Route exact path='/edit_job/:job_id' component={CreateJob}></Route>
    <Route exact path='/profile' component={Profile}></Route>
    <Route exact path='/edit_profile' component={EditProfile}></Route>
    <Route exact path='/profile/:username' component={Profile}></Route>
    <Route exact path='/jobs' component={EditJobs}></Route>
    <Route exact path='/jobs/:username' component={ViewJobs}></Route>
    <Route component={RedirectToHomepage} /> {/* Final route -- unrecognized URL --> homepage */}
  </Switch>);
}

export default function App() {
  return (<div className="App">
    <Auth0ProviderWithHistory>
      <BrowserRouter>
          <Main></Main>
      </BrowserRouter>
    </Auth0ProviderWithHistory>
  </div>);
}
