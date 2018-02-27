import React, { Component } from 'react';
import './App.css';
import FlashCard from './FlashCard.js';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class FlashContainer extends Component {

	constructor(props){
    	super(props);

    	this.state = {data: [],
    				  question: "",
    				  answer: "",
    				  queryData: [],
    				  auth: this.props.auth,
    				  showButton: true,
    				  packaged: [],
    				  modal: false,
    				  modalQuestion: 0,
    				  isQuestion: true};
    	this.writeProps = this.writeProps.bind(this);
    	this.submitHandler = this.submitHandler.bind(this);
    	this.tester = this.tester.bind(this);
    	this.deleteHandler = this.deleteHandler.bind(this);
    	this.shuffleCards = this.shuffleCards.bind(this);
    	this.updateHandler = this.updateHandler.bind(this);
    	this.toggleModal = this.toggleModal.bind(this);
    	this.showAnswer = this.showAnswer.bind(this);
    	this.nextQuestion = this.nextQuestion.bind(this);
	}

	// Handles get requests
	writeProps(){
	    axios.get("https://infinite-beach-29483.herokuapp.com/api/flashcards/"+this.state.auth)
	      .then(res => {
	        this.setState({data: res.data});
	        this.state.data.length === 0 ? this.setState({showButton: false}) : this.setState({showButton: true});
	      })
	}

	// Handles post requests
	submitHandler(e){
		e.preventDefault();

		let packaged = {userKey: this.state.auth,
						question: this.questionText.value,
						answer: this.answerText.value};
		
		axios.post("https://infinite-beach-29483.herokuapp.com/api/flashcards", packaged)
			.then(res => {
				this.writeProps();
			})
			.catch(err => {
				console.error(err);
			});
	}

	// TODO: initialize props in constructor instead
	componentDidMount(){
		this.setState({auth: this.props.auth});
		this.writeProps();
	}

	// Handles Delete requests
	deleteHandler(id){
		axios.delete('https://infinite-beach-29483.herokuapp.com/api/flashcards/'+id)
			.then(res => {
				this.writeProps();
			})
			.catch(err => {
				console.error(err);
			});
	}

	// Handles put requests
	updateHandler(id, newQuestion, newAnswer){
		let packaged = {
			userKey: this.state.auth,
			question: newQuestion,
			answer: newAnswer
		};

		axios.put('https://infinite-beach-29483.herokuapp.com/api/flashcards/'+id, packaged)
			.then(res => {
				this.writeProps();
			})
			.catch(err => {
				console.catch(err);
			});
	}

	// Durstenfield shuffle used to randomize order of cards
	shuffleCards(){
		let copy = this.state.data;
		for (var i = copy.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = copy[i];
	        copy[i] = copy[j];
	        copy[j] = temp;
	    }
	    this.setState({data: copy});
	}

	// Function used for testing, generates bunch of cards
	tester(){
		for(let i = 0; i < 20; i++){
			this.questionText.value = i;
			this.answerText.value = i + 1;
			this.submitHandler(this.questionText);
		}
	}

	toggleModal() {
	    this.setState({
	      modal: !this.state.modal
	    });
	}

	// Changes state to question or answer of modal
	showAnswer(){
		this.setState({isQuestion: !this.state.isQuestion});
	}

	// Goes to next question of quiz modal
	nextQuestion(){
		let currQuestion = this.state.modalQuestion + 1;
		if(currQuestion > this.state.data.length - 1)
			currQuestion = 0;

		this.setState({
			isQuestion: true,
			modalQuestion: currQuestion
		});
	}

	render() {

		let flashData = this.state.data;
		let cards = flashData.map((data, index) => <FlashCard question={data.question} 
															  answer={data.answer} 
															  key={data._id} 
															  idKey={data._id}
															  handleClick={this.deleteHandler}
															  handleUpdate={this.updateHandler}/>);

		let modalDataQuestion = this.state.data.length > 0 ? this.state.data[this.state.modalQuestion].question : "";
		let modalDataAnswer = this.state.data.length > 0 ? this.state.data[this.state.modalQuestion].answer : "";
		let modalData = this.state.isQuestion ? modalDataQuestion : modalDataAnswer;

		return(
			<div>

				<Container>
					<Row>
						<Col>
							<form id="inputArea" onSubmit={this.submitHandler}>
								    <br/>
								    <textarea type="text" ref={(input)=> this.questionText = input} className="inputBox" placeholder="Input a question"/>
						            <br/>
						            <textarea type="text" ref={(input) => this.answerText = input} className="inputBox" placeholder="Input an answer"/>
						            <br/>
						            <Button outline color="warning" type="submit">Add Card</Button>
						    </form>
						    <div>
						    <Button style={{visibility: this.state.showButton ? 'visible' : 'hidden' }} color="danger"  onClick={this.shuffleCards}> Shuffle Cards </Button>
						    <Button style={{visibility: this.state.showButton ? 'visible' : 'hidden' }} color="warning" onClick={this.toggleModal}>Test Yourself</Button>
						    </div>
					    </Col>
				    </Row>
			    </Container>

			    
			    <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="ModalDrop">
			    <ModalHeader toggle={this.toggleModal}></ModalHeader>
		          <ModalBody>
		            {modalData}
		          </ModalBody>
		          <ModalFooter>
		            <Button color="primary" onClick={this.showAnswer}>{this.state.isQuestion ? "Show Answer" : "Show Question"}</Button>{' '}
		            <Button color="secondary" onClick={this.nextQuestion}>Next Question</Button>
		          </ModalFooter>
        		</Modal>

			    <Container>
				    <Row>
					    <Col lg="auto">
								{cards}
						</Col>
					</Row>
				</Container>

			    
		    </div>
			);

	}
}

export default FlashContainer;