import React, {Component} from 'react';
import MonacoEditor from 'react-monaco-editor';

class Assignment extends Component{
    state = {
        assignment: [],
        attachedFile: null,
        code: '# type your code...',
    }

    componentDidMount = () =>{
        fetch(`http://localhost:8000/api/v1/assignments/${this.props.match.params.id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${this.props.getToken()}`
            }})
        .then(res => res.json())
        .then(result => {
            this.setState({assignment:result})
        });

    }

    editorDidMount = (editor, monaco) => {
        console.log('editorDidMount', editor);
        editor.focus();
    }
    onChange = (newValue, e) =>{
    }

    handleChange = (e) =>{
        this.setState({attachedFile: e.target.files[0]});
      }
    
    handleSumbit = (e) =>{
        e.preventDefault();
        let formData = new FormData();
        
        formData.append('feedback',null)
        formData.append('attached_file',this.state.attachedFile)
        formData.append('assignment',this.props.match.params.id)
        formData.append('created_by',"1")
        
        fetch("http://localhost:8000/api/v1/submissions/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Token ${this.props.getToken()}`,
            },
            body: formData
            })
            .then(res => (res.json()))
            .then(result => {this.setState({
                    id: result.id
                });
            });
      }

    render(){
        const code = this.state.code;
        const options = {
            selectOnLineNumbers: true
        };

        return(
            <div>
                <h3>{this.state.assignment.title}</h3>
                <p>{this.state.assignment.description}</p>
                <form onSubmit={this.handleSumbit}>
                    <input type="file" 
                        onChange={this.handleChange}>
                    </input>
                
                    <MonacoEditor
                        width="800"
                        height="600"
                        language="python"
                        theme="vs-dark"
                        value={code}
                        options={options}
                        onChange={this.onChange}
                        editorDidMount={this.editorDidMount}
                    />
                    <input type="submit" value="Send assignment"></input>
                </form>
            </div>
        );
    }
    
}

export default Assignment;