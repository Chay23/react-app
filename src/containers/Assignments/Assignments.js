import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {baseUrl} from "../../config";

import './Assignments.css';

class Assignments extends Component{
    state = {
        assignments: []
    }
    componentDidMount = async () => {
        const req = await fetch(baseUrl + "/assignments/", {
        method: 'GET',
        headers: {
            'Authorization': `Token ${this.props.getToken()}`
        }});
        const assignments = await req.json();
        this.setState({assignments:assignments});

    }


    render(){
        let assignmentList = this.state.assignments.length !== 0 ? this.state.assignments.map((assignment, index) => (
            <h3 key={assignment.id} className="assignment-item">
                <Link to={`/assignments/${assignment.id}`} className="link-to-assignment">{assignment.title}</Link></h3>
        )) : <h3>No assignmets yet</h3>

        return(
            <div className="center container">
                <h2>Available assignments</h2>
                <hr/>
                <div className="assignments-list">
                    {assignmentList}
                </div>
            </div>
        );
    }
    
}

export default Assignments;