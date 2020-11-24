import React, { Component } from 'react';

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

    handleRegistration = () => {
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
    }
    
    render(){
        return (
            <div>
                <form onSubmit={this.handleSubmit}></form>
                Login <input type="text" name="email" value={this.props.login} onChange={this.updateState}/><br/>
                Password <input type="password" name="password" value={this.props.password} onChange={this.updateState}/><br/>
                Confirm password <input type="password" name="re_password" value={this.props.password} onChange={this.updateState}/><br/>
                <input type="submit" value="Sign up" onClick={this.handleRegistration}/>
            </div>
        );
    }

}


export default Registration;