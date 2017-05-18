import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import S3Explorer from './S3'
import NameForm from './NameForm'
import { BrowserRouter as Router, Route, Switch, browserHistory, Link } from 'react-router-dom'

class App extends Component {
  render() {
    console.log(NameForm);
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to S3 Explorer</h2>
        </div>
        <Router history={browserHistory}>
          <div>
            <Switch>
              <Route path='/:buckName' component = {S3Explorer} />
              <Route path='/' component = {NameForm} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

