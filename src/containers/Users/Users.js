import React, {Component} from 'react';
import './Users.css'
import {baseUrl} from "../../config";

class  Users extends Component {
    state = {
        users: [],
        group: ""
    }
    
    getCurrentUserGroup = async () => {
        const req = await fetch(baseUrl + `/users/${this.props.getUserId()}/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${this.props.getToken()}`
        }})
        const result = await req.json();
        this.setState({
            group:result.group}, 
            () => {this.getUsersInGroup()}
        );
    };

    getUsersInGroup = async() => {
        const req = await fetch(baseUrl + `/users/group/${this.state.group}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${this.props.getToken()}`
        }})
        const users = await req.json()
        this.setState({users:users});

    };

    componentDidMount = () => {
        this.getCurrentUserGroup();
    };
    render(){
        let usersList = this.state.users.length !== 0 ? this.state.users.map((user, index) => (
            <div key={user.user.id} className='user-item'>
                <h4>{user.first_name} {user.last_name}</h4>
                <p>{user.user.email}</p>
            </div>
        )) :<h3>Oops, no users found</h3> 
        return(
            <div className='container center'>
               <h2>Group name: {this.state.group}</h2>
               <hr/>
               <div className='users-list'>
              {usersList}
              </div>
            </div>
        );
    }
}


export default Users;