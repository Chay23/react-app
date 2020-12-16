import React, { Component } from 'react';
import './Login.css';
class Login extends Component{
    
    state = {
        password: "",
        email: ""
    }

    render(){
        return (
            <div className="container form-group text-center">
                <form onSubmit={this.props.handleToken}>
                Email <input  className="form-control" type="text" name="email" value={this.props.email} onChange={this.props.handleState } /><br/>
                Password < input className="form-control"  type="password" name="password" value={this.props.password} onChange={this.props.handleState} />
                <input className="button" type="submit" value="Sign in"/>
                </form>
            </div>
        );
    }

}

export default Login;