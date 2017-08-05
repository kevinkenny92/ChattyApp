import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx';
import NavBar from './NavBar.jsx';
import UserCount from './UserCount.jsx';

const appData = {
  currentUser: {name: "Bob"},
  messages: [],
  userCount: 0
}

const ws = new WebSocket("ws://0.0.0.0:3001/");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = appData;
  }

///test //

  addMessage(message) {
    const newMessage = {
      type: "postMessage",
      id: new Date(),
      username: this.state.currentUser.name,
      content: message
    };
    ws.send(JSON.stringify(newMessage));
    console.log("A new message has been sent: ")
    console.log(newMessage);
  }

  changeUser(user) {
    let originalUser = this.state.currentUser.name;
    // If a user hasn't entered a name, assign them "Anonymous"
    let newUser = user || "Anonymous";
    this.setState({
      currentUser: {name: newUser}
    });
    console.log("Current user changed to " + newUser);
    let notificationStatement = (`${originalUser} changed their name to ${newUser}.`);
    let userChangeNotification = {
      type: "postNotification",
      id: new Date(),
      content: notificationStatement
    };
    ws.send(JSON.stringify(userChangeNotification));
  }


  componentDidMount() {
    console.log("componentDidMount <App />");
    ws.onopen = function(event) {
      console.log('Connected to server', event);
    }
    ws.onmessage = (event) => {
      console.log("Received event: ");
      console.log(event);
      let data = JSON.parse(event.data);
      switch(data.type) {
        case "userCountUpdate":
          const updatedUserCount = data.content;
          this.setState({
            userCount: updatedUserCount
          });
          console.log("Updated User Count inside switch!");
          break;
        case "incomingMessage":
        case "incomingNotification":
          const updatedMessages = this.state.messages.concat(data);
          this.setState({
            messages: updatedMessages
          });
          break;
        default:
          throw new Error("Unknown event type " + data.type);
      }
    }
  }

  render() {
    console.log("Rendering <App/>");
    return (
      <div>
        <NavBar userCount={this.state.userCount} />
        <MessageList messages={this.state.messages} />
        <ChatBar currentUser={this.state.currentUser} addOneMessage={this.addMessage.bind(this)} changeCurrentUser={this.changeUser.bind(this)} />
      </div>
    );
  }
}
export default App;