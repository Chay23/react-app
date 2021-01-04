import { Link } from "react-router-dom";
import React, {Component} from 'react';
import { Alert } from 'react-bootstrap';

import {baseUrl} from "../../../config";

import './Subject.css';

class Subject extends Component{
    state = {
        subject: "",
        status: "",
        lectures: []
    }

    getSubjectById = async (subject_id, token) =>{
        const res = await fetch(baseUrl + `/subjects/${subject_id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }})
            .catch(err => {
                this.handleFetchError(0);
                return err;
            })
            if(res.ok){
                const subj = await res.json();
                this.setState({ subject: subj });
                this.setState({status:res.status});
            }else{
                this.handleFetchError(res.status);
            }
           
    }

    getSubjectLectures = async (subject_id, token) =>{
        const res = await fetch(baseUrl + `/subjects/${subject_id}/lectures`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        const lectures = await res.json();
        this.setState({lectures: lectures});
    }

    handleFetchError = (status) => {
        if(status === 0){
            localStorage.msg = 'Can not connect to server';
            localStorage.msg_type = 'danger';
        }
        else if(status === 400 || status === 404){
            localStorage.msg = 'Invalid assignment id';
            localStorage.msg_type = 'danger';
        }
        this.setState({alert: true});
        this.forceUpdate();
    }

    componentDidMount = () =>{
        const subject_id = this.props.match.params.id;
        const token = this.props.getToken();
        this.getSubjectById(subject_id, token);
        this.getSubjectLectures(subject_id, token);
    }

    showAlert = () => {
        return this.state.alert ? 'block' : 'none'
    }

    render(){
        const status = this.state.status;
        let lectures = this.state.lectures;
        let subject;
        let lecturesList;

        if (status !== 404){
            subject = <div>
                        <h1>{this.state.subject.title}</h1>
                    </div>
            if (lectures.length > 0){
                lecturesList = lectures.map((lecture, index) => (
                    <div className='container'>
                        <Alert className="alert" style={{display: this.showAlert()}}variant={localStorage.msg_type}>{localStorage.msg}</Alert>
                        <div>
                            <p>
                                <h4>{index + 1 + "."} 
                                <Link to={`/subjects/${this.props.match.params.id}/lectures/${lecture.id}`} className="link-to-lecture">{lecture.title}</Link>
                                </h4>
                            </p>
                        </div>
                    </div>
                ));
            }else {
                lecturesList = <h5 className='text-center font-weight-light'>No lectures for now</h5>
            }


        }else{
            subject = <h3>No subject found</h3>
        }
        
        return(
            <div className='container'>
                <Link to={'/subjects'} className="btn btn-outline-dark back-button">Back</Link>
                {subject}
                <hr/>
                <h3>Available lectures</h3>
                {lecturesList}
            </div>
        )
    }
}

export default Subject;