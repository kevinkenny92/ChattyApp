import React, {Component} from 'react';
import ChatBar from './chatBar.jsx';
import Message from './message.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  render() {
    console.log("Rendering <App/>");
    return (
      <div>
        <MessageList />
        <ChatBar />
      </div>
    );
  }
}
export default App;