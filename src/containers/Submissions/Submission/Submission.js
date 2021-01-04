import React from 'react';
import { Component } from 'react';
import {Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import {baseUrl} from '../../../config';

import './Submission.css';

class Submission extends Component{

    state = {
        submission: [],
        alert: false
    }

    componentDidMount = async () =>{
        const req = await fetch(baseUrl + `/submissions/${this.props.match.params.submissionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${this.props.getToken()}`
            }})
            .catch(err => {
                this.handleFetchError(0);
                return err;
            })
            if(req.ok){
                const submission = await req.json();
                this.setState({
                    submission: submission, 
                    feedback: submission.feedback
                })
            }else{
                this.handleFetchError(req.status);
                this.forceUpdate();
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
        else if(status === 404){
            localStorage.msg = 'Invalid submission id';
            localStorage.msg_type = 'danger';
        }
        this.setState({alert: true});
        this.forceUpdate();
    }


    getAttachedFileName = () => {
        let fileName = '';
        if(this.state.submission.attached_file){
            fileName = this.state.submission.attached_file;
            fileName = fileName.match(/[-\s\w\d]*.py$/);
            fileName = fileName[0]
        }
        return fileName;
    }

    showAlert = () => {
        return this.state.alert ? 'block' : 'none'
    }

    render (){
        let fileName = this.getAttachedFileName();
        return(
            <div className="container">
                <Link to={`/assignments/${this.props.match.params.id}/submissions`} className="btn btn-outline-dark back-button">Back</Link>
                <h2>Submission {this.props.match.params.submissionId}</h2>
                <hr/>
                <Alert className="alert" style={{display: this.showAlert()}}variant={localStorage.msg_type}>{localStorage.msg}</Alert>
                <div className="submission-file">
                    <h4>File</h4>
                    <a href={baseUrl + `/submissions/file/${fileName}`}>{fileName}</a>
                </div>
            </div>
        );
    }
}

export default Submission;