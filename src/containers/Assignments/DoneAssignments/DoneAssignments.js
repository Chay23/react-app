import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Alert} from 'react-bootstrap';

import {baseUrl} from "../../../config";

import '../Assignments.css';

class Assignments extends Component{
    
    state = {
        assignments: [],
        alert: false
    }

    componentDidMount = async () => {
        const req = await fetch(baseUrl + `/assignments/user/${this.props.getUserId()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${this.props.getToken()}`
            }})
            .catch(err => {
                this.handleFetchError(0);
                return err;
            })
        if(req.ok){
            const assignments = await req.json();
            this.setState({assignments:assignments});
        }
    }

    componentWillUnmount(){
        delete localStorage.msg;
        delete localStorage.msg_type;
    }

    handleFetchError = (status) => {
        if(status === 0){
            localStorage.msg = 'Can not connect to server';
            localStorage.msg_type = 'danger';
        }
        this.setState({alert: true});
        this.forceUpdate();
    }
    

    showAlert = () => {
        return this.state.alert ? 'block' : 'none'
    }

    render(){
        let assignmentList = this.state.assignments.length !== 0 ? this.state.assignments.map((assignment, index) => (
            <h3 key={assignment.id} className="assignment-item">
                <Link to={`/assignments-done/${assignment.id}/submissions`} className="link-to-assignment">{assignment.title}</Link></h3>
        )) : <h3>No assignmets yet</h3>

        return(
            <div className="center container">
                <h2>Select assignment</h2>
                <hr/>
                <Alert className="alert" style={{display: this.showAlert()}}variant={localStorage.msg_type}>{localStorage.msg}</Alert>
                <div className="assignments-list">
                    {assignmentList}
                </div>
            </div>
        );
    }
    
}

export default Assignments;