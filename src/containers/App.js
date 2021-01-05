import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

import Layout from '../components/Layout/Layout';
import Nav from '../components/Nav/Nav';
import Login from './Login/Login';
import Registration from './Registration/Registration';
import Users from './Users/Users';
import ChangePassword from './Users/ChangePassword/ChangePassword';
import Main from '../components/Main/Main';
import Assignments from './Assignments/Assignments';
import Assignment from './Assignments/Assignment/Assignment';
import Subjects from './Subjects/Subjects';
import Subject from './Subjects/Subject/Subject';
import Submissions from './Submissions/Submissions';
import Lecture from './Lecture/Lecture';
import DoneAssignments from './Assignments/DoneAssignments/DoneAssignments';

import {baseUrl} from "../config";

import './App.css';

class App extends Component {
  state = {
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

  componentDidMount = () => {
    if(this.getCookie('token')){
      this.setState({token:this.getCookie('token')});
      this.getCurrentUserId();
      this.getUserStatus();
    }
  }

  handleState = (e) => {
    this.setState((prevState, props) => {
      return {[e.target.name]: e.target.value};
    });
  }

   requireAuth = () => {
     if (this.getCookie('token')){
       return false;
     }
     return true;
  }

  handleLoginError = (status) => {
    if(status === 0){
      localStorage.msg = 'Can not connect to server';
      localStorage.msg_type = 'danger';
    }
    else if(status === 400){
      localStorage.msg = 'Wrong email or password or user not registered';
      localStorage.msg_type = 'danger';
    }
  }

  deleteMessages = () => {
    delete localStorage.msg;
    delete localStorage.msg_type;
  }

  handleToken = async (e) => {
    e.preventDefault();
    this.deleteMessages()
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
    .catch((err) => {
      this.handleLoginError(0);
      return err;
    })
    
    if(req.ok){
      const result = await req.json()
      this.setState({token: result.auth_token});
      document.cookie = `token=${this.state.token}; path=/`;
      this.setState({password: ""})
      await this.getCurrentUserId();
    }
    else{
      this.handleLoginError(req.status);
      this.forceUpdate();
    }
  }

  logout = () => {
    document.cookie = 'token=; path=/';
    document.cookie = 'id=; path=/';
    document.cookie = 'is_staff=; path=/';
    this.setState({email:''})
    this.forceUpdate();
  }

  getCurrentUserId = async () => {
    if(this.getCookie('token')){
      const req = await fetch(baseUrl + "/auth/users/me/", {
          method: 'GET',
          headers: {
              'Authorization': `Token ${this.getCookie('token')}`
              }})
      const cur_user = await req.json();
      document.cookie = `id=${cur_user.id}; path=/`;
    }
  }

  getUserStatus = async () => {
    const req = await fetch(baseUrl + `/users/${this.getCookie('id')}/profile`, {
      method: 'GET',
      headers: {
          'Authorization': `Token ${this.getCookie('token')}`
      }})
      const result = await req.json();
      document.cookie = `is_staff=${result.user.is_staff}; path=/`
  }

  render(){
  return (
    <Router>
      <Nav logout={this.logout} requireLogin={this.requireAuth}/>
      <Layout>
        <Route 
        path='/' exact
        component={Main}
        />
        <Route
        path='/login'
        render={(props) => this.requireAuth() ? (<Login {...props} email={this.state.email} password={this.state.password} handleState={this.handleState} handleToken={this.handleToken} showError={() => this.handleError()}/>) : (<Redirect to="/"/>)}
        />
        <Route
        path='/registration'
        render={ (props) => this.requireAuth() ? (<Registration {...props} handleState={this.handleState} handleToken={this.handleToken} getCookie={this.getCookie} getUserStatus={() =>this.getCookie('is_staff')}/>) : (<Redirect to="/"/>)}
        />
        <Route 
        exact path='/users'
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<Users {...props} getToken={() =>this.getCookie('token')} getUserId={() =>this.getCookie('id')}/>)}
        />
        <Route 
        path='/users/change-password'
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<ChangePassword {...props} getToken={() =>this.getCookie('token')} getUserId={() =>this.getCookie('id')}/>)}
        />
        <Route 
        exact path='/assignments' 
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<Assignments {...props} getToken={() =>this.getCookie('token')} getUserId={() =>this.getCookie('id')} getUserStatus={() =>this.getCookie('is_staff')}/>)}
        />
        <Route 
        exact path='/assignments/:id' 
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<Assignment {...props} getToken={() =>this.getCookie('token')} getUserId={() =>this.getCookie('id')}/>)}
        />
        <Route 
        exact path='/assignments-done' 
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<DoneAssignments {...props} getToken={() =>this.getCookie('token')} getUserId={() =>this.getCookie('id')}/>)}
        />
        <Route 
        exact path='/assignments-done/:id/submissions' 
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<Submissions {...props} getToken={() =>this.getCookie('token')}/>)}
        />
        <Route 
        exact path='/subjects' 
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<Subjects {...props} getToken={() =>this.getCookie('token')}/>)}
        />
        <Route
        exact path='/subjects/:id'
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<Subject {...props} getToken={() => this.getCookie('token')} getUserId={() =>this.getCookie('id')}/>)}
        />
        <Route 
        exact path='/subjects/:id/lectures/:lectureId' 
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<Lecture {...props} getToken={() =>this.getCookie('token')}/>)}
        />
      </Layout>
    </Router>
  );
  }
}

export default App;