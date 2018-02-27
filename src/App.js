import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FlashContainer from './FlashContainer.js';
import FacebookAuth from 'react-facebook-auth';
class App extends Component {

  constructor(props){
    super(props);

    this.state = {data: [],
                  question: "",
                  answer: "",
                  auth: ""};
    this.authenticate = this.authenticate.bind(this);
  }


  componentDidMount(){
  }

  authenticate(res){
    if(res.id === undefined)
      return;
    this.setState({auth: res.id});
  }

  render() {

    let MyFacebookButton = ({ onClick }) => (
      <button onClick={onClick}>
        Login with facebook
      </button>
    );

    let container = ""

    if(this.state.auth !== ""){
      container = <FlashContainer auth={this.state.auth}
                                  url="https://infinite-beach-29483.herokuapp.com/api/flashcards/"/>
      MyFacebookButton = ({ onClick }) => (
        <div> </div>
        )
    }

    return (
      <div className="App">

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Flashcard generator</h1>
        </header>

          <FacebookAuth   
            appId="removed"
            callback={this.authenticate}
            component={MyFacebookButton}
            autoLoad={false}
          />
          {container}
      </div>
    );

  }
}

export default App;