
import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Layout from '../components/Layout/Layout';
import Nav from '../components/Nav/Nav';
import Login from './Login/Login';
import Registration from './Registration/Registration';
import Users from '../components/Users/Users';
import Main from '../components/Main/Main';
import Assingments from './Assignments/Assignments';
import Assingment from './Assignments/Assignment/Assignment';


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
    // document.cookie = `token=${undefined}`;

  }

   requireAuth = (nextState, replace, next) => {
    let authenticated = false;
     if (this.getCookie('token') !== undefined){
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
    this.setState({password:""})
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
        onEnter={this.requireAuth}
        />
        <Route 
        path='/assignments' exact
        render={props => <Assingments {...props} getToken={() =>this.getCookie('token')}/>}
        />
        <Route 
        path='/assignments/:id'
        render={props => <Assingment {...props} getToken={() =>this.getCookie('token')} getUserId={() =>this.getCookie('id')}/>}
        />
      </Layout>
    </Router>
  );
  }
}

export default App;