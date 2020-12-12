import { Link } from "react-router-dom";
import React, {Component} from 'react';

class Subject extends Component{
    state = {
        subject: "",
        status: ""
    }
    componentDidMount = async () =>{
        const res = await fetch(`http://localhost:8000/api/v1/subjects/${this.props.match.params.id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${this.props.getToken()}`
        }});
        const subj = await res.json();
        this.setState({subject:subj})
        this.setState({status:res.status});
    }

    render(){
        const status = this.state.status;
        const elements = [];
        if (status !== 404){
            elements.push(<h1>{this.state.subject.title}</h1>)
            elements.push(<h5>{this.state.subject.description}</h5>)
            elements.push(<p>Instructor: <Link>{this.state.subject.user}</Link></p>)
        }else{
            elements.push(<h3>No subject found</h3>)
        }
        return(
            <div>
                {elements}
            </div>
        )
    }
}

export default Subject;