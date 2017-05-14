import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import S3Explorer from './S3'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to S3 Explorer</h2>
        </div>
        <S3Explorer />
      </div>
    );
  }
}

export default App;
