import React, { Component } from 'react';
import style from './Registration.module.css';

class Registration extends Component{
    
    state = {
        id: "",
        email: "",
        password: "",
        re_password: "",
        first_name: "",
        last_name: "",
        group: "",
        token: ""
    }

    updateState = (e) => {
        this.setState((prevState, props) => {
            return {[e.target.name]: e.target.value};
          });
    }

    createProfile = (token) =>{
        fetch(`http://localhost:8000/api/v1/users/${this.state.id}/profile/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(
                    {
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                    group: this.state.group
            }
            )})
            .then(res => (res.json()))
            .then(result => {console.log(result)})
    }

    handleRegistration = (e) => {
        e.preventDefault();
        fetch("http://localhost:8000/api/v1/auth/users/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                email: this.state.email, 
                password: this.state.password, 
                re_password: this.state.re_password
                }
            )})
            .then(res => (res.json()))
            .then(result => {this.setState({
                    id: result.id
                });
                document.cookie = `id=${result.id}`;
            })
        
        this.setState({password:'',re_password:''});
        
        setTimeout(() => this.props.handleToken(e), 2000);
        let token = this.props.getCookie('token')
        
        setTimeout(() => this.createProfile(token), 3000);
    }
    
    // {
        // "first_name":"Bob",
        // "last_name":"Zamora",
        // "group":"IPZ-31"
    // }


    render(){
        return (
            <div className="container form-group text-center">
                <form onSubmit={e => {this.handleRegistration(e)}}>
                    First name <input className="form-control"  type="text" name="first_name" value={this.state.first_name} onChange={this.updateState}/><br/>
                    Last name <input className="form-control"  type="text" name="last_name" value={this.state.last_name} onChange={this.updateState}/><br/>
                    Group <input className="form-control"  type="text" name="group" value={this.state.group} onChange={this.updateState}/><br/>
                    Email <input className="form-control"  type="text" name="email" value={this.state.email} onChange={e => {this.updateState(e); this.props.handleState(e)}}/><br/>
                    Password <input className="form-control"  type="password" name="password" value={this.state.password} onChange={e => {this.updateState(e); this.props.handleState(e)}}/><br/>
                    Confirm password <input className="form-control"  type="password" name="re_password" value={this.state.re_password} onChange={this.updateState} /><br/>
                    <input  className={style.button} type="submit" value="Sign up"/>
                </form>
            </div>
        );
    }

}


export default Registration;