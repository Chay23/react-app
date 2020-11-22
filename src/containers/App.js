import classes from'./App.module.css';
import React, { Component } from 'react';
import Layout from '../components/Layout/Layout'
import Login from './Login/Login'

const API_URL = 'http://localhost:8000';

class App extends Component {
  state = {
    user: []
  };

  componentDidMount(){
    console.log("ComponentDidMount()")
  }

  render(){
  return (
    <Layout>
      <Login />
    </Layout>
  );
  }
}

export default App;
