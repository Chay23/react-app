import React, { Component } from 'react';
import {Alert} from 'react-bootstrap';
import './Registration.css';
import {baseUrl} from "../../config";

class Registration extends Component{
    
    state = {
        email: "",
        password: "",
        re_password: "",
        first_name: "",
        last_name: "",
        group: "",
        groups: [],
        noGroups: false
    }

    async componentDidMount(){
        await this.getGroups();
        this.forceUpdate();
        
    }

    updateState = (e) => {
        this.setState((prevState, props) => {
            return {[e.target.name]: e.target.value};
          });
    }

    handleRegisterError = (status) => {
        if(status === 0){
            localStorage.msg = 'Can not connect to server';
            localStorage.msg_type = 'danger';
        }
        else if(status === 400){
            localStorage.msg = 'Incorrect email or password confirmation or user already registered';
            localStorage.msg_type = 'danger';
        }
    }
    
    deleteMessages = () => {
        delete localStorage.msg;
        delete localStorage.msg_type;
    }

    getGroups = async () =>{
        const res = await fetch(baseUrl + '/users/groups/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        });
        const data = await res.json();
        await this.setState({groups: data})
        if (data.length > 0 && data['0'] && data['0'] !== ''){
            await this.setState({group:data['0'].group})
        }else{
            await this.setState({noGroups:true});
        }
        
    }

    createProfile = async (token, id) =>{
        await fetch(baseUrl + `/users/${id}/profile/`, {
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
            )});
            await this.props.getUserStatus();
            await this.props.history.push('/');            
    }

    handleRegistration = async (e) => {
        e.preventDefault();
        
        const req = await fetch(baseUrl + "/auth/users/", {
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
        .catch(err => {
            this.handleRegisterError(0);
            return err;
        })
        if(req.ok){
            const user = await req.json()
            this.setState({id: user.id});
            document.cookie = `id=${user.id}`;
            
            this.setState({
                password: '',
                re_password: ''
            });
            await this.props.handleToken(e);
            await this.createProfile(this.props.getCookie('token'), this.props.getCookie('id'));
        }
        else{
            this.handleRegisterError(req.status);
            this.forceUpdate();
        }
    }
    
    componentWillUnmount(){
        delete localStorage.msg;
        delete localStorage.msg_type;
    }

    render(){
        let groups = this.state.groups;
        let field;
        if (this.state.noGroups){
            field = <input className="form-control"  type="text" name="group" value={this.state.group} onChange={this.updateState}/>
        } else {
            field = <select className="form-control" name="group" onChange={this.updateState}>
                    {groups.map((group, index)=> <option selected="selected" key={index} value={group.group}>{group.group}</option>)}
                    </select>
        }

        return (
            <div className="container form-group text-center">
                <h1>Registration</h1>
                <Alert className="alert-registration" variant={localStorage.msg_type}>{localStorage.msg}</Alert>
                <form onSubmit={e => {this.handleRegistration(e)}}>
                    First name <input className="form-control"  type="text" name="first_name" value={this.state.first_name} onChange={this.updateState}/><br/>
                    Last name <input className="form-control"  type="text" name="last_name" value={this.state.last_name} onChange={this.updateState}/><br/>
                    Group {field}<br/>  
                    Email <input className="form-control"  type="text" name="email" value={this.state.email} onChange={e => {this.updateState(e); this.props.handleState(e)}}/><br/>
                    Password <input className="form-control"  type="password" name="password" value={this.state.password} onChange={e => {this.updateState(e); this.props.handleState(e)}}/><br/>
                    Confirm password <input className="form-control"  type="password" name="re_password" value={this.state.re_password} onChange={this.updateState} /><br/>
                    <input  className="btn btn-outline-dark custom-registration-submit" type="submit" value="Sign up"/>
                </form>
            </div>
        );
    }

}


export default Registration;