import logo from './logo.svg';
import './App.css';

import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Home from './components/homepage';
import Signup from './components/signup';
import Search from './components/search';

const Main = () => {
  return (<Switch>
    {/* The Switch decides which component to show based on the current URL. */}
    <Route exact path='/' component={Home}></Route>
    <Route exact path='/signup' component={Signup}></Route>
    <Route exact path='/search' component={Search}></Route>
  </Switch>);
}

function App() {
  return (<div className="App">
    <Main></Main>
  </div>);
}

export default App;
