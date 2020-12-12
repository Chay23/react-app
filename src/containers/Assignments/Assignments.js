import React, {Component} from 'react';
import {Link} from 'react-router-dom'
class Assignments extends Component{
    state = {
        assignments: []
    }
    componentDidMount = async () => {
        const req = await fetch("http://localhost:8000/api/v1/assignments/", {
        method: 'GET',
        headers: {
            'Authorization': `Token ${this.props.getToken()}`
        }});
        const assignments = await req.json();
        this.setState({assignments:assignments});

    }


    render(){
        let assignmentList = this.state.assignments.length !== 0 ? this.state.assignments.map((assignment, index) => (
            <h3 key={assignment.id}>
                <Link to={`/assignments/${assignment.id}`}>{assignment.title}</Link></h3>
        )) : <h3>No assignmets yet</h3>

        return(
            <div>
                {assignmentList}
            </div>
        );
    }
    
}

export default Assignments;