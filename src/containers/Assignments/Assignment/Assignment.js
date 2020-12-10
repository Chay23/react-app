import React, {Component} from 'react';
import MonacoEditor from 'react-monaco-editor';

class Assignment extends Component{
    state = {
        assignment: [],
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

    editorDidMount(editor, monaco) {
        console.log('editorDidMount', editor);
        editor.focus();
    }
    onChange(newValue, e) {
        console.log('onChange', newValue, e);
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
                <form>
                    <input type="file"></input>
                    <p><textarea rows="4" cols="60"></textarea></p>
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
                </form>
            </div>
        );
    }
    
}

export default Assignment;