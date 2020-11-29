import React, { Component } from 'react';
import style from './Registration.module.css';

class Registration extends Component{
    
    state = {
        email: "",
        password: "",
        re_password: ""
    }

    updateState = (e) => {
        this.setState((prevState, props) => {
            return {[e.target.name]: e.target.value};
          });
    }

    handleRegistration = (e) => {
        e.preventDefault();
        let request = fetch("http://localhost:8000/api/v1/auth/users/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)})
            .then(res => { console.log(res.status);
                return(res.json());})
            .then(result => (console.log(result)))
        this.setState({password:'',re_password:''})
    }
    
    render(){
        return (
            <div className="container form-group text-center">
                <form onSubmit={this.handleRegistration}>
                    Login <input className="form-control"  type="text" name="email" value={this.state.email} onChange={this.updateState}/><br/>
                    Password <input className="form-control"  type="password" name="password" value={this.state.password} onChange={this.updateState}/><br/>
                    Confirm password <input className="form-control"  type="password" name="re_password" value={this.state.re_password} onChange={this.updateState} /><br/>
                    <input  className={style.button} type="submit" value="Sign up"/>
                </form>
            </div>
        );
    }

}


export default Registration;