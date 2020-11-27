import React, { Component } from 'react';
import style from './Login.module.css';
class Login extends Component{
    
    state = {
        password: "",
        email: ""
    }

    render(){
        return (
            <div className="container form-group text-center">
                <form onSubmit={this.handleSubmit}  ></form>
                Login <input  className="form-control" type="text" name="email" value={this.props.login} onChange={this.props.handleLogin } /><br/>
                Password < input className="form-control"  type="password" name="password" value={this.props.password} onChange={this.props.handleLogin} />
                <input className={style.button} type="submit" value="Sign in" onClick={this.props.handleToken}/>
            </div>
        );
    }

}

export default Login;