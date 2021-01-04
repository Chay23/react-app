import React from 'react';
import { Component } from 'react';
import {Link} from 'react-router-dom';
import {Alert} from 'react-bootstrap';

import {baseUrl} from '../../config';

class Submissions extends Component{

    state = {
        submissions: [],
        searchValue: ''
    }

    componentDidMount = async () =>{
        const req = await fetch(baseUrl + "/submissions/", {
            method: 'GET',
            headers: {
                'Authorization': `Token ${this.props.getToken()}`
            }})
            .catch(err => {
                this.handleFetchError(0);
                return err;
            })
            .catch(err => {
                this.handleFetchError(0);
                return err;
            })
        if(req.ok){
            const submissions = await req.json();
            this.setState({submissions: submissions});
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

    changeSearchValue = (e) => {
        this.setState({searchValue: e.target.value})
    }

    handleSearchSubmit = (e) => {
        e.preventDefault();
        this.forceUpdate();
    }

    getAttachedFileName = (fileName) => {
        // let fileName = '';
        // if(this.state.submission.attached_file){
            // fileName = this.state.submission.attached_file;
        fileName = fileName.match(/[-\s\w\d]*.py$/);
        fileName = fileName[0]
        // }
        return fileName;
    }

    showAlert = () => {
        return this.state.alert ? 'block' : 'none'
    }
    
    render (){
        let submissionList = '';
        if(this.state.searchValue){
            submissionList = this.state.submissions.length !== 0 ? this.state.submissions.map((submission, index) => {
                if(submission.attached_file.match(this.state.searchValue.toLocaleLowerCase())){
                return <p key={submission.id} className="">
                     <a href={baseUrl + `/submissions/file/${this.getAttachedFileName(submission.attached_file)}`}>{this.getAttachedFileName(submission.attached_file)}</a>
                </p>
                }  
                    /* <Link to={`/assignments/${this.props.match.params.id}/submissions/${submission.id}`} className="link-to-assignment">Submission {submission.id}</Link></h3> */
                }) : <h3>No submissions found</h3>
        }else{
            submissionList = this.state.submissions.length !== 0 ? this.state.submissions.map((submission, index) => (
                <p key={submission.id} className="">
                    <a href={baseUrl + `/submissions/file/${this.getAttachedFileName(submission.attached_file)}`}>{this.getAttachedFileName(submission.attached_file)}</a>
                </p>  
                    /* <Link to={`/assignments/${this.props.match.params.id}/submissions/${submission.id}`} className="link-to-assignment">Submission {submission.id}</Link></h3> */
                )) : <h3>No submissions yet</h3>
        }
        return(
            <div className='container'>
                <Link to={'/assignments-done'} className="btn btn-outline-dark back-button">Back</Link>
                <h2>Submissions</h2>
                <form className="form-inline" onSubmit={this.handleSearchSubmit}>
                    {/* <div class="form-group"> */}
                        <input className="form-control border-dark custom-search-input" type="text" value={this.state.searchValue} onChange={this.changeSearchValue} placeholder="Seach"/>
                        <input className="btn btn-outline-dark custom-search-button" type="submit" value="Search"/>
                    {/* </div> */}
                </form>
                <hr/>
                <Alert className="alert" style={{display: this.showAlert()}}variant={localStorage.msg_type}>{localStorage.msg}</Alert>
                <div className="submission-file">
                    <h4>Files</h4>
                    {submissionList}
                </div>
            </div>
        );
    }
}

export default Submissions;