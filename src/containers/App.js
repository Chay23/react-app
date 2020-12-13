
import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Layout from '../components/Layout/Layout';
import Nav from '../components/Nav/Nav';
import Login from './Login/Login';
import Registration from './Registration/Registration';
import Users from './Users/Users';
import Main from '../components/Main/Main';
import Assingments from './Assignments/Assignments';
import Assingment from './Assignments/Assignment/Assignment';
import Subjects from './Subjects/Subjects';
import Subject from './Subjects/Subject/Subject';
import {baseUrl} from "../config";

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

  componentDidMount = async () => {
    if(this.getCookie('token')){
      this.setState({token:this.getCookie('token')});
    }
    await this.getCurrentUserId()
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

  handleToken = async (e) => {
    e.preventDefault();
    const req = await fetch(baseUrl + "/auth/token/login/", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        body: JSON.stringify({
            password: this.state.password,
            email: this.state.email
          })})
    const result = await req.json()
    this.setState({token: result.auth_token});
    document.cookie = `token=${this.state.token}`;

    this.setState({password: ""})
    await this.getCurrentUserId();
  }

  getCurrentUserId = async () => {
    const req = await fetch(baseUrl + "/auth/users/me/", {
        method: 'GET',
        headers: {
            'Authorization': `Token ${this.getCookie('token')}`
            }})
    const cur_user = await req.json();
    document.cookie = `id=${cur_user.id}`;
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
        render={props => <Users {...props} getToken={() =>this.getCookie('token')} getUserId={() =>this.getCookie('id')}/>}
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
        <Route 
        exact path='/subjects' 
        render={props => <Subjects {...props} getToken={() =>this.getCookie('token')} />}
        />
        <Route
        path='/subjects/:id'
        render={props => <Subject {...props} getToken={() => this.getCookie('token')} getUserId={() =>this.getCookie('id')} />}
        />
      </Layout>
    </Router>
  );
  }
}

export default App;