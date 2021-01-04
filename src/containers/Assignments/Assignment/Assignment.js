import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";


import {baseUrl} from "../../../config";

import './Assignment.css';


class Assignment extends Component{
    
    state = {
        assignment: [],
        attachedFile: null,
        code: '# type your code...',
        editorWasChanged: false,
        fileName: '',
        alert: false,
        disabled: true
    }

    componentDidMount = async () => {
        delete localStorage.msg;
        delete localStorage.msg_type;
        const req = await fetch(baseUrl + `/assignments/${this.props.match.params.id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${this.props.getToken()}`
        }})
        .catch(err => {
            this.handleFetchError(0);
            return err;
        })
        if(req.ok){
            const assignment = await req.json()
            this.setState({assignment: assignment})

        }else{
            this.handleFetchError(req.status);
        }
        
    }

    componentWillUnmount = () => {
        delete localStorage.msg;
        delete localStorage.msg_type;
    }

    editorDidMount = (editor, monaco) => {
        editor.focus();
    }

    onChange = (newValue, e) => {
        this.setState({code: newValue})
        this.setState({
            editorWasChanged: true,
            disabled: false
        });
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
        else if(status === 400 || status === 404){
            localStorage.msg = 'Invalid assignment id';
            localStorage.msg_type = 'danger';
        }
        this.setState({alert: true});
        this.forceUpdate();
    }

    handleChangeFile = async(e) => {
        this.setState({attachedFile: e.target.files[0]});
        setTimeout(() => {this.checkValidFileExtension()},100);
    }

    checkValidFileExtension = async () => {
        let fileName = this.state.attachedFile.name
        fileName = fileName.match(/[-\s\w\d]*.py$/);
        if(!fileName){
            localStorage.msg = 'Invalid file extension. Please, choose another one';
            localStorage.msg_type = 'danger';
            this.setState({
                attachedFile: null,
                alert: true,
                disabled: true
            })
            this.forceUpdate();
        }
        else{
            this.setState({disabled: false});
        }
    }
    
    handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        if (this.state.editorWasChanged){
            await this.createFile()
            await this.getFileName()
            formData.append('attached_file', this.state.attachedFile, this.state.fileName)
        }else{
            formData.append('attached_file', this.state.attachedFile)
        }
        
        formData.append('feedback', null)
        formData.append('assignment', this.props.match.params.id)
        formData.append('created_by', this.props.getUserId())
        
        const req = await fetch(baseUrl + "/submissions/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Token ${this.props.getToken()}`,
            },
            body: formData
        })
        if(!req.ok){
            this.handleFetchError(req.status);
            this.forceUpdate();
        }
    }



    getDataFromEditor = () => {
        const model = this.refs.monaco.editor.getModel();
        const value = model.getValue();
        return value
    }

    createFile = async () => {
        let data = this.getDataFromEditor();
        let blob =  new Blob([data], {type: 'text/plain'})
        let file = new File([blob], 'name');
        this.setState({attachedFile:file})
    }
    
    getFileName = async () => {
        const req = await fetch(baseUrl + `/users/${this.props.getUserId()}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${this.props.getToken()}`
                }})
            const user = await req.json()
           this.setState({fileName: `assignment_${this.props.match.params.id}_${(user.group).toLowerCase()}_${(user.last_name).toLowerCase()}.py`})
    }

    showAlert = () => {
        return this.state.alert ? 'block' : 'none'
    }

    render(){
        const code = this.state.code;
        const options = {
            selectOnLineNumbers: true
        };

        return(
            <div className="center container">
                <Link to={'/assignments'} className="btn btn-outline-dark back-button">Back</Link>
                <h2>{this.state.assignment.title}</h2>
                <hr/>
                <Alert className="alert-assignment" style={{display: this.showAlert()}}variant={localStorage.msg_type}>{localStorage.msg}</Alert>
                <h3>Task</h3>
                <div className="assignment-description">
                    <p>{this.state.assignment.description}</p>
                </div>
                <h4>Send file (.py)</h4>
                <form onSubmit={this.handleSubmit}>
                    <label className="btn btn-outline-dark custom-input-file">
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
                    <input type="submit" disabled={this.state.disabled} value="Send assignment" className="btn btn-outline-dark submit-button"></input>
                </form>
            </div>
        );
    }
    
}

export default Assignment;