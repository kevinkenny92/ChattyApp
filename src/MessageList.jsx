import React, {Component} from 'react';
import Message from './message.jsx';

class MessageList extends Component {
  render() {
    console.log("Rendering <MessageList/>");
    return (
      <main className="messages">
        <div>
          <Message />
        </div>

      </main>
    );
  }
}
export default MessageList;