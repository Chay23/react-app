import React, { Component } from 'react';
import {Alert} from 'react-bootstrap';
import './Login.css';
class Login extends Component{
    
    state = {
        password: "",
        email: ""
    }

    componentDidMount = () =>{
        this.forceUpdate();
    }

    componentWillUnmount = () => {
        delete localStorage.msg;
        delete localStorage.msg_type;
    }

    render(){
        return (
            <div className="container form-group text-center login-form">
                <h1>Well cum</h1>
                <Alert variant={localStorage.msg_type}>{localStorage.msg}</Alert>
                <form onSubmit={this.props.handleToken}>
                <strong>Email</strong> <input  className="form-control" type="text" name="email" value={this.props.email} onChange={this.props.handleState } /><br/>
                <strong>Password</strong> < input className="form-control"  type="password" name="password" value={this.props.password} onChange={this.props.handleState} />
                <input className="btn btn-outline-dark" type="submit" value="Sign in"/>
                </form>
            </div>
        );
    }

}

export default Login;