import { Link } from "react-router-dom";
import React, {Component} from 'react';
import {baseUrl} from "../../../config";

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
            }});
            const subj = await res.json();
            this.setState({ subject: subj });
            this.setState({status:res.status});
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
    componentDidMount = () =>{
        const subject_id = this.props.match.params.id;
        const token = this.props.getToken();
        this.getSubjectById(subject_id, token);
        this.getSubjectLectures(subject_id, token);
    }

    render(){
        const status = this.state.status;
        let lectures = this.state.lectures;
        let subject;
        let lecturesList;

        if (status !== 404){
            subject = <div>
                        <h1>{this.state.subject.title}</h1><br/>
                        <h5 className='text-justify'>{this.state.subject.description}</h5>
                    </div>
            if (lectures.length > 0){
                lecturesList = lectures.map((lecture, index) => (
                    <div className='container'>
                        <div className='row'>
                            <div className="col-1 align-self-center">
                                <p className='h4'>{index + 1}</p>
                            </div>
                            <div className='col align-self-start'>
                                <p className='h4'>{lecture.title}</p>
                                <p className='text-justify' style={{fontFamily:"Georgia"}}>{lecture.text}</p><br/>
                            </div>
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
                {subject}
                <hr/>
                {lecturesList}
            </div>
        )
    }
}

export default Subject;