import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './App.css';

class FlashCard extends Component {

	constructor(props){
		super(props);
		this.state = {isQuestion: true,
					  handleClick: null,
					  idKey: "",
					  question: "",
					  answer: "",
					  dropdownOpen: false};

		this.toggle = this.toggle.bind(this);
		this.stateHandler = this.stateHandler.bind(this);
		this.deleteHandler = this.deleteHandler.bind(this);
		this.modifyHandler =  this.modifyHandler.bind(this);
		this.sendUpdate = this.sendUpdate.bind(this);
	}

	// Changes card to question or to answer
	stateHandler(){
		this.state.isQuestion ? this.setState({isQuestion: false}) : this.setState({isQuestion: true});
	}

	// Handles deleting of card
	deleteHandler(){
		this.state.handleClick(this.state.idKey);
	}

	// Handles modifying of card
	modifyHandler(){
		this.state.modify ? this.setState({modify: false}) : this.setState({modify: true});
	}

	// Handles toggling of quizzing modal
	toggle() {
	    this.setState({
	      dropdownOpen: !this.state.dropdownOpen
	    });
  	}

  	// Handles updating of cards
	sendUpdate(){
		this.props.handleUpdate(this.state.idKey, this.questionText.value, this.answerText.value);
		this.setState({modify: false});
	}

	// TODO: initialize props in constructor instead
	componentDidMount(){
		this.setState({isQuestion: true,
					   handleClick: this.props.handleClick,
					   idKey: this.props.idKey,
					   question: this.props.question,
					   answer: this.props.answer,
					   modify: false});
	}


	render() {

		let buttonText = this.state.isQuestion ? "Show Answer" : "Show Question";

		let text = 	<div style={{display: this.state.modify ? 'none' : 'block' }}>
						<div className="FlashCardTextContainer">
							{this.state.isQuestion ? this.props.question : this.props.answer}
						</div>
					   	<div className="FlashButtonContainer">
							<Button color="success" onClick={this.stateHandler}>{buttonText}</Button>
						</div>
					</div>

		let update = <div style={{display: this.state.modify ? 'block' : 'none' }}>
						<textarea defaultValue={this.props.question} type="text" ref={(input)=> this.questionText = input} className="inputBox" placeholder="Input a question"/>
				        <br/>
				   		<textarea defaultValue={this.props.answer} type="text" ref={(input) => this.answerText = input} className="inputBox" placeholder="Input a answer"/>
				   		<br/>
				   		<Button onClick={this.sendUpdate} color="danger">Update</Button>
			   		</div>

		return(
				<div className='FlashCard'> 
					<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
						<DropdownToggle color="success" caret>Edit</DropdownToggle>
						<DropdownMenu>
			          		<DropdownItem onClick={this.deleteHandler}>Delete Card</DropdownItem>
			          		<DropdownItem onClick={this.modifyHandler}>Update Card</DropdownItem>
		          		</DropdownMenu>
	          		</Dropdown>

					<Button style={{display: this.state.modify ? 'block' : 'none' }} color="warning" onClick={this.modifyHandler}>Cancel Update</Button>
						{text}
						{update}
				</div>
			);
	}

}

export default FlashCard;