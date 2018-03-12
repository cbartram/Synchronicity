import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Client from './Client';

class App extends Component {
  constructor() {
      super();

      this.state = {
          socket: ''
      }
  }

  componentDidMount = () => {
      this.setState({socket: new Client()});
  };

  handleClick = () => {
     this.state.socket.queryAll('Hello');
  };

  handleDisconnect = () => {
      this.state.socket.disconnect();
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button style={{height:50, width:100, backgroundColor:'white', fontSize:'15px', border:'3px solid rgb(128, 216, 247)', borderRadius:'0px'}} onClick={this.handleClick}>Emit</button>
          <button style={{height:50, width:100, backgroundColor:'white', fontSize:'15px', border:'3px solid rgb(213, 84, 94)', borderRadius:'0px'}} onClick={this.handleDisconnect}>Disconnect</button>

      </div>
    );
  }
}

export default App;
