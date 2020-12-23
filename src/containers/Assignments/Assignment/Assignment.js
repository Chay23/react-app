import React, {Component} from 'react';
import MonacoEditor from 'react-monaco-editor';
import {baseUrl} from "../../../config";

import './Assignment.css';


class Assignment extends Component{
    state = {
        assignment: [],
        attachedFile: null,
        code: '# type your code...',
        editorWasChanged: false,
        fileName: ''
    }

    componentDidMount = async () =>{
        const req = await fetch(baseUrl + `/assignments/${this.props.match.params.id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${this.props.getToken()}`
            }})
        const assignment = await req.json()
        this.setState({assignment:assignment})
    }

    editorDidMount = (editor, monaco) => {
        editor.focus();
    }

    onChange = (newValue, e) =>{
        this.setState({code:newValue})
        this.setState({editorWasChanged:true})
    }

    handleChangeFile = (e) =>{
        this.setState({attachedFile: e.target.files[0]});
    }
    
    handleSumbit = async (e) =>{
        e.preventDefault();
        let formData = new FormData();
        if (this.state.editorWasChanged){
            await this.createFile()
            await this.getFileName()
            formData.append('attached_file',this.state.attachedFile, this.state.fileName)
        }else{
            formData.append('attached_file',this.state.attachedFile)
        }
        
        formData.append('feedback',null)
        formData.append('assignment',this.props.match.params.id)
        formData.append('created_by',"1")
        
        const req = await fetch(baseUrl + "/submissions/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Token ${this.props.getToken()}`,
            },
            body: formData
            })
        const result = await req.json()
        this.setState({id: result.id});
      }

    getDataFromEditor = () => {
        const model = this.refs.monaco.editor.getModel();
        const value = model.getValue();
        return value
    }

    createFile = async () =>{
        let data = this.getDataFromEditor();
        let blob =  new Blob([data], {type: 'text/plain'})
        let file = new File([blob], 'name');
        this.setState({attachedFile:file})
    }
    
    getFileName = async () =>{
        const req = await fetch(baseUrl + `/users/${this.props.getUserId()}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${this.props.getToken()}`
                }})
            const user = await req.json()
           this.setState({fileName: `assignment_${this.props.match.params.id}_${(user.group).toLowerCase()}_${(user.last_name).toLowerCase()}.py`})
    }

    render(){
        const code = this.state.code;
        const options = {
            selectOnLineNumbers: true
        };

        return(
            <div className="center container">
                <h2>{this.state.assignment.title}</h2>
                <hr/>
                <h3>Task</h3>
                <div className="assignment-description">
                    <p>{this.state.assignment.description}</p>
                </div>
                <h4>Send file</h4>
                <form onSubmit={this.handleSumbit}>
                <label class="btn btn-outline-dark custom-input-file">
                    <input type="file" 
                        onChange={this.handleChangeFile}>
                    </input>
                    Choose file
                </label>
                    <h4>Or type your code</h4>
                    <div className="editor">
                        <MonacoEditor
                            ref="monaco"
                            width="100%"
                            height="550"
                            language="python"
                            theme="vs-dark"
                            value={code}
                            options={options}
                            onChange={this.onChange}
                            editorDidMount={this.editorDidMount}
                        />
                    </div>
                    <input type="submit" value="Send assignment" className="btn btn-outline-dark"></input>
                </form>
            </div>
        );
    }
    
}

export default Assignment;