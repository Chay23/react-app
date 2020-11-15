import classes from'./App.module.css';
import React, { Component } from 'react';

const API_URL = 'http://localhost:8000';

class App extends Component {
  state = {
    user: []
  };
  componentDidMount(){
    console.log("Fetching...")
      // fetch("http://localhost:8000/api/v1/subjects/", {mode: 'cors', credentials: 'same-origin'})
      // .then(res => res.json())
      // .then(result => (console.log(result.items)))
  }
  render(){
  return (
    <div className={classes.App}>
    </div>
  );
  }
}

export default App;
