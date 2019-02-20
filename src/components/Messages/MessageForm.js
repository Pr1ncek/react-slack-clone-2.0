import React from 'react';
import firebase from '../../firebase';
import { Segment, Button, Input } from 'semantic-ui-react';

class MessageForm extends React.Component {
  state = {
    message: '',
    currentChannel: this.props.currentChannel,
    currentUser: this.props.currentUser,
    sending: false
  };

  handleChange = event => this.setState({ [event.target.name]: event.target.value });

  sendMessage = async () => {
    const { messagesRef } = this.props;
    const { message, currentChannel } = this.state;
    try {
      if (message) {
        this.setState({ sending: true });
        await messagesRef
          .child(currentChannel.id)
          .push()
          .set(this.createMessage());
        this.setState({ message: '' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ sending: false });
    }
  };
  createMessage = () => {
    const { currentUser, message } = this.state;
    const newMessage = {
      content: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      sender: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };
    return newMessage;
  };

  render() {
    return (
      <Segment className="message__form" style={{ padding: '20px' }}>
        <Input
          fluid
          size="huge"
          name="message"
          style={{ marginBottom: '0.7em' }}
          label={<Button icon="smile outline" />}
          placeholder="Write your message..."
          value={this.state.message}
          onChange={this.handleChange}
        />
        <Button.Group icon widths="2">
          <Button
            style={{ padding: '15px' }}
            color="blue"
            content="Send Message"
            labelPosition="left"
            icon="edit"
            fluid
            onClick={this.sendMessage}
          />
          <Button
            color="red"
            content="Upload Media"
            labelPosition="left"
            icon="cloud upload"
            fluid
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;
