import React, {Component} from 'react';
import MonacoEditor from 'react-monaco-editor';
import {baseUrl} from "../../../config";


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
        this.getDataFromEditor()
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
            <div>
                <h3>{this.state.assignment.title}</h3>
                <p>{this.state.assignment.description}</p>
                <form onSubmit={this.handleSumbit}>
                    <input type="file" 
                        onChange={this.handleChangeFile}>
                    </input>
                
                    <MonacoEditor
                        ref="monaco"
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