import classes from'./App.module.css';

import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Layout from '../components/Layout/Layout';
import Nav from '../components/Nav/Nav';
import Login from './Login/Login';
import Registration from './Registration/Registration';
import Users from '../components/Users/Users';
import Main from '../components/Main/Main';


class App extends Component {
  state = {
    user: [],
    email: "",
    password: "",
    token: ""

  };

  getCookie = (name) =>{
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  componentDidMount(){
    if(this.getCookie('token')){
      this.setState({token:this.getCookie('token')});
    }
  }

   requireAuth = (nextState, replace, next) =>{
    let authenticated = false;
     if (localStorage.getItem('token')){
       authenticated = true
     }
    if (!authenticated) {
      replace({
        pathname: "/login",
        state: {nextPathname: nextState.location.pathname}
      });
    }
    next();
  }

  handleState = (e) => {
    this.setState((prevState, props) => {
      return {[e.target.name]: e.target.value};
    });
  }

  handleToken = (e) => {
    e.preventDefault();
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
          this.setState({token: result.auth_token});
          document.cookie = `token=${this.state.token}`;
          });
  }

  render(){
  return (
    <Router>
      <Layout>
        <Nav/>
        <Route 
        path='/' exact
        component={Main}
        />
        <Route
        path='/login'
        render={(props) => (<Login {...props} email={this.state.email} password={this.state.password} handleState={this.handleState} handleToken={this.handleToken}/>)}
        />
        <Route
        path='/registration'
        render={ (props) => (<Registration {...props} handleState={this.handleState} handleToken={this.handleToken} getCookie={this.getCookie}/>)}
        />
        <Route 
        path='/users'
        render={props => <Users {...props} token={this.state.token}/>}
        />
      </Layout>
    </Router>
  );
  }
}

export default App;