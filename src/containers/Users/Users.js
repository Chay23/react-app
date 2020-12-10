import React, {Component} from 'react';
import './Users.css'

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
            <div key={user.user.id} className='user-item'>
                <h4>{user.first_name} {user.last_name}</h4>
                <p>{user.user.email}</p>
            </div>
        )) :<h3>No users ops</h3> 
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