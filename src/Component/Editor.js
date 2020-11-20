import React, { Component,useState } from "react";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FormControl } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'

import '../App.css';

import axios from 'axios';
import InputField from './InputField';



//https://frozen-atoll-01566.herokuapp.com/api/run`



class Editor extends Component{
  constructor() {
    super();
    this.state = {mycode:'',status:0,output:'',loading:false,summiting:false,A:[],inputstate:false,myinput:"",done:false };
	this.onchange = this.onchange.bind(this);
	this.handleCompile = this.handleCompile.bind(this);
	this.changeOutput = this.changeOutput.bind(this);
	this.changeInput = this.changeInput.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
	  this.inputstateChange=this.inputstateChange.bind(this);
  }
	
 componentDidUpdate(previousProps, previousState){
	  if(previousProps.code!=this.props.code){
		  fetch(this.props.content).then(res => res.text()).then(text => this.setState({ mycode:this.props.code }));
	  }
	  
  }
	inputstateChange(){
		let newstate=!this.state.inputstate;
		this.setState({inputstate:newstate});
	}
	
	componentDidMount(){
		this.setState({mycode:this.props.code});
	} 
	onchange(newvalue){
		  this.setState({mycode:newvalue});
	}
	changeOutput(event){
		this.setState({output:event.target.value});
	}
	
	changeInput(event){
		this.setState({myinput:event.target.value});
	}
	
	handleCompile(){
	const headers = {
        'Content-Type': 'text/plain'
    };
	 this.setState({loading:true});
		
	 axios.post(`https://frozen-atoll-01566.herokuapp.com/api/run`, {
		 lang:'java',
		 code:this.state.mycode+this.props.test,
		 input:this.state.myinput
	 })
      .then(res => {
		let data=res.data;
		let status=parseInt(data.message.status);
		console.log(res)
		this.setState({
			status:status,
			output:data.message,
			loading:false,
			inputstate:false
		});
      });
	}
	
	handleSubmit(){
	const headers = {
        'Content-Type': 'text/plain'
    };
	 this.setState({summiting:true});
	 axios.post(`https://frozen-atoll-01566.herokuapp.com/api/submit`, {
		 lang:'java',
		 code:this.state.mycode+this.props.submit
	 })
      .then(res => {
		let data=res.data;
		let status=parseInt(data.message.status);
		let B=data.message.split("\n");
		
		let result=[];
		let message=[];
		
		let t=this.props.testcase;
		if(B.length<t){
			t=0;
		}
		for(let i=B.length-1;i>=0;i--){
			if(B[i].length==0)continue;
			if(t>0){
				result.push(B[i]);
				t--;
			}
			else{
				message.push(B[i]);
			}
			
		}
		 
		this.setState({
			status:status,
			output:message.reverse().join("\n"),
			summiting:false,
			inputstate:false,
			done:true,
			A:result.reverse()
		});
      });
	}
	
	
	
	
  render(){
	  let B=<Button className="outline-primary" ><i class="fa fa-refresh fa-spin"></i></Button>;
	  let S=<Button className="btn-info" style={{'margin':'5%'}} ><i class="fa fa-refresh fa-spin"></i></Button>;
	  let stateButon="";
      let smalltext="";
	  
	 if(this.state.inputstate){
		 stateButon=<Button className="btn-success " style={{'margin':'5%'}} onClick={this.inputstateChange}>My output</Button>;
		 smalltext="Input Your Data please!"
	 }
	 else{
		 stateButon=<Button className="btn-success" style={{'margin':'5%'}} onClick={this.inputstateChange} >Input</Button>;
	     smalltext="Here is Your Output!"
	 }

	  let textarea=	<textarea
		  			  className="output"
					  name="code"
					  type="textarea"
					  componentClass="textarea"
					  rows="5"
		  			  cols="100"
		  			  width={200}
					  value={this.state.output}
		  			  onChange={this.changeOutput}
				 />;
	  
	  if(this.state.inputstate){
		  textarea=	<textarea
		  			  className="output"
					  name="code"
					  type="textarea"
					  componentClass="textarea"
					  rows="5"
		  			  cols="100"
		  			  width={200}
					  value={this.state.myinput}
		  			  onChange={this.changeInput}
				 />;
	  }	
					  
	  let inputs=[];
	  
	  for(let i=0;i<this.props.testcase;i++){
		  if(!this.state.done){
			  inputs.push(<InputField bstate={1} index={i} judge={this.props.judgecase[i]}/>)
		  }
			
		  else{
			  console.log((this.state.A));			  
			 if(this.state.A[i]!=null&&this.state.A[i].length>=1&&this.state.A[i].charAt(0)=='t'){
				 inputs.push(<InputField bstate={2} index={i} judge={this.props.judgecase[i]}/>)
			 }
			 else{
							 	
				 inputs.push(<InputField bstate={3} index={i} judge={this.props.judgecase[i]}/>)
			 }
		  }
		  
	  }
	  
	  if(!this.state.loading){
		  if(this.state.summiting){
			  B=<Button className="outline-primary">Compile</Button>;
		  }
		  else{
			 B=<Button className="outline-primary" onClick={this.handleCompile}>Compile</Button>; 
		  }
		  
	  }

	  if(!this.state.summiting){
		  if(this.state.loading){
			  S=<Button className="btn-info" style={{'margin':'5%'}}>Submit</Button>;
		  }
		  else{
			  S=<Button className="btn-info" style={{'margin':'5%'}} onClick={this.handleSubmit}>Submit</Button>;
		  }
		  
	  }
	  
	  return(
		  		<div>
		  			{inputs}
		  			<br/><br/>
					<AceEditor
					  height={500}
		  			  width={750}
					  mode="java"
					  theme="github"
					  name="blah2"
					  onChange={this.onchange}
					  fontSize={14}
					  showPrintMargin={true}
					  showGutter={true}
					  highlightActiveLine={true}
					  value={this.state.mycode}
					  setOptions={{
					  enableBasicAutocompletion: true,
					  enableLiveAutocompletion: true,
					  enableSnippets: false,
					  showLineNumbers: true,
					  tabSize: 2,
				  }}/>
		  		  {stateButon}
		  		<br/>
		  		{smalltext}
		  		{textarea}
		  		<br/>
		  		{B}{S}
		  		</div>
	  );
	  
  }
}




export default Editor;