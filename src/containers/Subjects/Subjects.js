import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import "./Subjects.css"
import {baseUrl} from "../../config";

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
        }});
        const subjs = await res.json();
        this.setState({subjects:subjs});

    }

    render(){
        let subjectList = this.state.subjects.length !== 0 ? this.state.subjects.map((subject, index) => (
            <div key={subject.id} className='subject-item'>
            <h3>
                <Link to={`/subjects/${subject.id}`}>{subject.title}</Link>
            </h3>
            </div>
        )) : <h3>No subjects yet</h3>
        return(
            <div className="container center">
                <h4>Available courses</h4>
                <div className="subjects-list">
                {subjectList}
                </div>
            </div>
        );
    }
    
}

export default Subjects;