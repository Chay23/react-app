import React, { Component } from 'react';
import {Alert} from 'react-bootstrap';
import {Link} from 'react-router-dom';


import {baseUrl} from "../../../config";


// import './Login.css';
class ChangePassword extends Component{
    
    state = {
        new_password: '',
        current_password: '',
        show_current_password: false,
        show_new_password: false
    }

    updateState = (e) => {
        this.setState((prevState, props) => {
            return {[e.target.name]: e.target.value};
        });
    }

    componentDidMount = () =>{
        this.forceUpdate();
    }

    componentWillUnmount = () => {
        delete localStorage.msg;
        delete localStorage.msg_type;
    }

    handleFetchError = (status) => {
        console.log(status)
        if(status === 0){
            localStorage.msg = 'Can not connect to server';
            localStorage.msg_type = 'danger';
        }
        else if(this.state.new_password.length < 8){
            localStorage.msg = 'New password too short';
            localStorage.msg_type = 'danger';
        }
        else if(status === 400){
            localStorage.msg = 'Wrong current password';
            localStorage.msg_type = 'danger';
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const req = await fetch(baseUrl + "/auth/users/set_password/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.props.getToken()}`
            },
            body: JSON.stringify(
                {
                new_password: this.state.new_password, 
                current_password: this.state.current_password, 
                }
            )})
        .catch(err => {
            this.handleFetchError(0);
            return err;
        })
        if(req.ok){
            localStorage.msg = 'Password changed successfully';
            localStorage.msg_type = 'success';
            this.forceUpdate();
        }
        else{
            console.log(req.text);
            this.handleFetchError(req.status);
            this.forceUpdate();
        }
    }

    toggleShowCurrentPassword = () => {
        this.setState((prevState, props) => {
            return {show_current_password: !prevState.show_current_password};
        });
    }

    toggleShowNewPassword = () => {
        this.setState((prevState, props) => {
            return {show_new_password: !prevState.show_new_password};
        });
    }

    render(){
        return (
            <div className="container">
                <Link to={'/users'} className="btn btn-outline-dark back-button">Back</Link>
                <div className="text-center change-password-form">
                    <h1>Change Password</h1>
                    <Alert className="alert-login" variant={localStorage.msg_type}>{localStorage.msg}</Alert>
                    <form onSubmit={this.handleSubmit}>
                        <strong>Current password</strong> <input  className="form-control" type={this.state.show_current_password ? "text" : "password"} name="current_password" value={this.props.current_password} onChange={this.updateState } />
                        <p>Show current password <input type="checkbox" onClick={this.toggleShowCurrentPassword}/></p>
                        <strong>New password</strong> < input className="form-control"  type={this.state.show_new_password ? "text" : "password"} name="new_password" value={this.props.new_password} onChange={this.updateState} />
                        <p>Show new password <input type="checkbox" onClick={this.toggleShowNewPassword}/></p>
                        <input className="btn btn-outline-dark custom-login-submit" type="submit" value="Change password"/>
                    </form>
                </div>
            </div>
        );
    }

}

export default ChangePassword;