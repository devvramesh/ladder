import logo from './logo.svg';
import './App.css';

import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";
import { useAuth0 } from "@auth0/auth0-react";

import Home from './components/homepage';
import Signup from './components/signup';
import Search from './components/search';
import Favorites from './components/favorites';
import Login from './components/login';
import CreateJob from './components/createjob';
import EmployeeProfile from './components/employee_profile';
import EmployerProfile from './components/employer_profile';
import Profile from './components/profile'
import Jobs from './components/jobs';

const Main = () => {
  return (<Switch>
    {/* The Switch decides which component to show based on the current URL. */}
    <Route exact path='/' component={Home}></Route>
    <Route exact path='/signup' component={Signup}></Route>
    <Route exact path='/login' component={Login}></Route>
    <Route exact path='/search' component={Search}></Route>
    <Route exact path='/favorites' component={Favorites}></Route>
    <Route exact path='/createjob' component={CreateJob}></Route>
    <Route exact path='/employee-profile' component={EmployeeProfile}></Route>
    <Route exact path='/employer-profile' component={EmployerProfile}></Route>
    <Route exact path='/profile' component={Profile}></Route>
    <Route exact path='/profile/:username' component={Profile}></Route>
    <Route exact path='/jobs' component={Jobs}></Route>
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
