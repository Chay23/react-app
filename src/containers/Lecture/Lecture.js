import React, { Component } from 'react';
import {Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import {baseUrl} from "../../config";

import './Lecture.css';

class Lecture extends Component{

    state = {
        lecture: [],
        alert: false
    }

    componentDidMount = async () => {
        const req = await fetch(baseUrl + `/lectures/${this.props.match.params.lectureId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${this.props.getToken()}`
            }})
            .catch(err => {
                this.handleFetchError(0);
                return err;
            })
        if(req.ok){
            const lecture = await req.json();
            this.setState({lecture: lecture});
        }else{
            this.handleFetchError(req.status);
        }
    }

    componentWillUnmount = () => {
        delete localStorage.msg;
        delete localStorage.msg_type;
    }

    handleFetchError = (status) => {
        if(status === 0){
            localStorage.msg = 'Can not connect to server';
            localStorage.msg_type = 'danger';
        }
        else if(status === 404){
            localStorage.msg = 'Invalid lecture id';
            localStorage.msg_type = 'danger';
        }
        this.setState({alert: true});
        this.forceUpdate();
    }

    showAlert = () => {
        return this.state.alert ? 'block' : 'none'
    }

    render(){
        return(
            <div className="container">
                <Link to={`/subjects/${this.props.match.params.id}`} className="btn btn-outline-dark back-button">Back</Link>
                <h2>{this.state.lecture.title}</h2>
                <hr/>
                <Alert className="alert" style={{display: this.showAlert()}}variant={localStorage.msg_type}>{localStorage.msg}</Alert>
                <div className="lecture-text-content">
                    <p className="lecture-text">{this.state.lecture.text}</p>
                </div>
            </div>
        );
    }
}

export default Lecture;