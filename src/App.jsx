import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import Message from './Message.jsx';
import MessageList from './MessageList.jsx';
import NavBar from './NavBar.jsx';
import UserCount from './UserCount.jsx';

const appData = {
  currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous //
  messages: [], // messages coming from the server will be stored here as they arrive //
  userCount: 0

}

const ws = new WebSocket("ws://0.0.0.0:3001/");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = appData;
  }

  addMessage(message) {
    const newMessage = {
      id: new Date(),
      username: this.state.currentUser.name,    //Send the new username to the App component so this.state.currentUser can be updated//

      content: message
    };
    ws.send(JSON.stringify(newMessage));
    console.log("A new message has been sent: ")
    console.log(newMessage);
  }

  changeUser(user) {
    let ogUser = this.state.currentUser.name;
    // If a user hasn't entered a name, assign them "Anonymous"
    let newUser = user || "Anonymous";
    this.setState({
      currentUser: {name: newUser}
    });
    console.log("Current user changed to " + newUser);
    // Send a postNotification message to the server
    let notificationStatement = (`${ogUser}  is now  ${newUser}.`);
    console.log("notificationStatement: ");
    console.log(notificationStatement);
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
          console.log("Updated User Count");
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