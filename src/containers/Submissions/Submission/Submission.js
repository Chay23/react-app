import React from 'react';
import { Component } from 'react';
import {baseUrl} from '../../../config';

import './Submission.css';

class Submission extends Component{

    state = {
        submission: [],
        changedFeedback: false,
        feedback: ''
    }

    componentDidMount = async () =>{
        const req = await fetch(baseUrl + `/submissions/${this.props.match.params.submissionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${this.props.getToken()}`
            }});
            const submission = await req.json();
            this.setState({
                submission: submission, 
                feedback: submission.feedback
            });
    } 

    handleFeedback = (e) => {
        this.setState({feedback: e.target.value})
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('feedback', this.state.feedback ? this.state.feedback : null)
        
        const reqSecond = await fetch(baseUrl + `/submissions/${this.props.match.params.submissionId}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Token ${this.props.getToken()}`,
            },
            body: formData
            })
        // const result = await req.json()
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

    render (){
        let fileName = this.getAttachedFileName();
        return(
            <div className="container">
                <h2>Submission {this.props.match.params.submissionId}</h2>
                <hr/>
                <div className="submission-file">
                    <h4>File</h4>
                    <a href={baseUrl + `/submissions/file/${fileName}`}>{fileName}</a>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <h4>Feedback</h4>
                    <p><textarea className="form-control custom-text-area" row='5' cols='45' name='feedback' onChange={this.handleFeedback} value={this.state.feedback === 'null' ? "" : this.state.feedback}></textarea></p>
                    <input className="btn btn-outline-dark" type="submit" value="Send"/>
                </form>
            </div>
        );
    }
}

export default Submission;