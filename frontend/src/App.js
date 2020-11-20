import logo from './logo.svg';
import './App.css';

import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";

import Home from './components/homepage';
import Signup from './components/signup';
import Search from './components/search';
import Favorites from './components/favorites'
import Login from './components/login'

const Main = () => {
  return (<Switch>
    {/* The Switch decides which component to show based on the current URL. */}
    <Route exact path='/' component={Home}></Route>
    <Route exact path='/signup' component={Signup}></Route>
    <Route exact path='/login' component={Login}></Route>
    <Route exact path='/search' component={Search}></Route>
    <Route exact path='/favorites' component={Favorites}></Route>
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
