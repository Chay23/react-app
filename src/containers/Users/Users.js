import React, {Component} from 'react';
import {Link} from 'react-router-dom';


class  Users extends Component {
    state = {
        users: [],
        group: ""
    }
    
    getCurrentUserGroup = () => {
        fetch(`http://localhost:8000/api/v1/users/${this.props.getUserId()}/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${this.props.getToken()}`
            }})
        .then(res => res.json())
        .then(result => (this.setState({group:result.group})));
    };

    getUserInGroup = () => {
        fetch(`http://localhost:8000/api/v1/users/group/${this.state.group}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${this.props.getToken()}`
            }})
        .then(res => res.json())
        .then(result => {this.setState({users:result})});
    };

    componentDidMount = () => {
        this.getCurrentUserGroup()
        setTimeout(() => {this.getUserInGroup()}, 1000)
    };
    render(){
        let usersList = this.state.users.length !== 0 ? this.state.users.map((user, index) => (
            <div key={user.user.id}>
                <h4>{user.first_name} {user.last_name}</h4>
                <h4>{user.user.email}</h4>
            </div>
        )) :<h3>No users ops</h3> 
        return(
            <div>
               <h2>{this.state.group}</h2>
              {usersList}
            </div>
        );
    }
}


export default Users;