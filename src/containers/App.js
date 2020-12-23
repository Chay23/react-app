import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

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

  componentDidMount = () => {
    if(this.getCookie('token')){
      this.setState({token:this.getCookie('token')});
      this.getCurrentUserId()
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
      document.cookie = `token=${this.state.token}`;
      this.setState({password: ""})
      this.getCurrentUserId();
    }
    else{
      this.handleLoginError(req.status);
      this.forceUpdate();
    }
  }

  logout = () => {
    document.cookie = 'token=';
    document.cookie = 'id=';
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
      document.cookie = `id=${cur_user.id}`;
    }
  }


  render(){
  return (
    <Router>
      <Layout>
        <Nav logout={this.logout} requireLogin={this.requireAuth}/>
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
        render={ (props) => this.requireAuth() ? (<Registration {...props} handleState={this.handleState} handleToken={this.handleToken} getCookie={this.getCookie}/>) : (<Redirect to="/"/>)}
        />
        <Route 
        path='/users'
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<Users {...props} getToken={() =>this.getCookie('token')} getUserId={() =>this.getCookie('id')}/>)}
        />
        <Route 
        path='/assignments' exact
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<Assingments {...props} getToken={() =>this.getCookie('token')} getUserId={() =>this.getCookie('id')} />)}
        />
        <Route 
        path='/assignments/:id'
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<Assingment {...props} getToken={() =>this.getCookie('token')} getUserId={() =>this.getCookie('id')}/>)}
        />
        <Route 
        exact path='/subjects' 
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<Subjects {...props} getToken={() =>this.getCookie('token')}/>)}
        />
        <Route
        path='/subjects/:id'
        render={props => this.requireAuth() ? (<Redirect to="/login"/>) : (<Subject {...props} getToken={() => this.getCookie('token')} getUserId={() =>this.getCookie('id')}/>)}
        />
      </Layout>
    </Router>
  );
  }
}

export default App;