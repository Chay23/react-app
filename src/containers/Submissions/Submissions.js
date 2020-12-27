import React from 'react';
import { Component } from 'react';
import {Link} from 'react-router-dom';
import {baseUrl} from '../../config';

class Submissions extends Component{

    state = {
        submissions: []
    }

    componentDidMount = async () =>{
        const req = await fetch(baseUrl + "/submissions/", {
            method: 'GET',
            headers: {
                'Authorization': `Token ${this.props.getToken()}`
            }});
            const submissions = await req.json();
            this.setState({submissions: submissions});
    } 
    
    render (){
        let submissionList = this.state.submissions.length !== 0 ? this.state.submissions.map((submission, index) => (
            <h3 key={submission.id} className="">
                <Link to={`/assignments/${this.props.match.params.id}/submissions/${submission.id}`} className="link-to-assignment">Submission {submission.id}</Link></h3>
            )) : <h3>No submissions yet</h3>

        return(
            <div className='container'>
                <h2>Submissions</h2>
                <hr/>
                {submissionList}
            </div>
        );
    }
}

export default Submissions;