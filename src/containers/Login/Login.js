import React, { Component } from 'react';

class Login extends Component{
    
    state = {
        password: "",
        email: ""
    }

    render(){
        return (
            <div>
                <form onSubmit={this.handleSubmit}></form>
                Login <input type="text" name="email" value={this.props.login} onChange={this.props.handleLogin} /><br/>
                Password <input type="password" name="password" value={this.props.password} onChange={this.props.handleLogin} />
                <input type="submit" value="Sign in" onClick={this.props.handleToken}/>
            </div>
        );
    }

}

export default Login;