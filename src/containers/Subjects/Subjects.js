import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Subjects extends Component {
    state = {
        subjects: []
    }
    componentDidMount = async () => {
        const token = await this.props.getToken();
        const res = await fetch("http://localhost:8000/api/v1/subjects/", {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
        }});
        const subjs = await res.json();
        this.setState({subjects:subjs});

    }

    render(){
        let subjectList = this.state.subjects.length !== 0 ? this.state.subjects.map((subject, index) => (
            <h3 key={subject.id}>
                <Link to={`/subjects/${subject.id}`}>{subject.title}</Link>
            </h3>
        )) : <h3>No subjects yet</h3>
        console.log(subjectList);
        return(
            <div>
                <h4>Showing all subjects</h4>
                {subjectList}
            </div>
        );
    }
    
}

export default Subjects;