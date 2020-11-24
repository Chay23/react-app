import classes from'./App.module.css';

import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Layout from '../components/Layout/Layout';
import Nav from '../components/Nav/Nav';
import Login from './Login/Login';
import Registration from './Registration/Registration';
import Users from '../components/Users/Users';


const API_URL = 'http://localhost:8000';

class App extends Component {
  state = {
    user: [],
    email: "",
    password: "",
    token: ""

  };

  handleLogin = (e) => {
    this.setState((prevState, props) => {
      return {[e.target.name]: e.target.value};
    });
  }

  handleToken = () => {
    fetch("http://localhost:8000/api/v1/auth/token/login/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        body: JSON.stringify({
            password: this.state.password,
            email: this.state.email
          })})
        .then(res => res.json())
        .then(result => {
          this.setState((prevState, props) => {
            return {token: result.auth_token};
          }); 
        })

  }

  render(){
  return (
    <Router>
      <Layout>
        <Nav/>
        <Route
        path='/login'
        render={(props) => (<Login {...props} login={this.state.login} password={this.state.password} handleLogin={this.handleLogin} handleToken={this.handleToken}/>)}
        />
        <Route
        path='/registration'
        component={Registration}
        />
      </Layout>
    </Router>
  );
  }
}

export default App;
