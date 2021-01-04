import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Alert} from 'react-bootstrap';


import {baseUrl} from "../../config";

import "./Subjects.css";

class Subjects extends Component {
    state = {
        subjects: []
    }

    componentDidMount = async () => {
        const token = await this.props.getToken();
        const res = await fetch(baseUrl + "/subjects/", {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
        }})
        .catch(err => {
            this.handleFetchError(0);
            return err;
        })
        if(res.ok){
            const subjs = await res.json();
            this.setState({subjects:subjs});
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
        let subjectList;
        if (this.state.subjects.length !== 0){
            <h4>Available courses</h4>
            subjectList = this.state.subjects.map((subject, index) => (
                <div key={subject.id}>
                <h3 className="subject-item">
                    <Link to={`/subjects/${subject.id}`} className="link-to-subject">{subject.title}</Link>
                </h3>
                </div>
            ))
        } else {
            subjectList = <h4>No subjects yet</h4>

        }
    
        return(
            <div className="container center">
                <h2>Available subjects</h2>
                <hr/>
                <Alert className="alert" style={{display: this.showAlert()}}variant={localStorage.msg_type}>{localStorage.msg}</Alert>
                <div className="subjects-list">
                {subjectList}
                </div>
            </div>
        );
    }
    
}

export default Subjects;