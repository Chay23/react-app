import React, {Component} from 'react';
import {Link} from 'react-router-dom'
class Assignments extends Component{
    state = {
        assignments: []
    }
    componentDidMount = () =>{
        fetch("http://localhost:8000/api/v1/assignments/", {
        method: 'GET',
        headers: {
            'Authorization': `Token ${this.props.getToken()}`
            }})
        .then(res => res.json())
        .then(result => {
            this.setState({assignments:result})
        });

    }


    render(){

        let assignmentList = this.state.assignments.map((assignment, index) => (
            <h3 key={assignment.id}>
                <Link to={`/assignments/${assignment.id}`}>{assignment.title}</Link></h3>
        ))

        return(
            <div>
                {assignmentList}
            </div>
        );
    }
    
}

export default Assignments;