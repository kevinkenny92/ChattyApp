//Step 3- Adding a new message when enter is hit //

import React, {Component} from 'react';

class ChatBar extends Component {
  render() {
    console.log("Rendering <ChatBar/>");
    return (
      <footer className="chatbar">
        <input className="chatbar-username" defaultValue={this.props.currentUser.name} placeholder="Bob  (Optional)" />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyDown={(event) => {
          if (event.key === 'Enter') {
            this.props.addOneMessage(event.target.value);
            event.target.value = '';
          }
        }} />
      </footer>
    );
  }
}
export default ChatBar;