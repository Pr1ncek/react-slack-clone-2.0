import React, { Component } from 'react';
import firebase from '../../firebase';
import { Segment, Comment } from 'semantic-ui-react';

import MessageHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    privateMessagesRef: firebase.database().ref('privateMessages'),
    messages: [],
    filteredMessages: [], // used for searching messages
    messagesLoading: true,
    currentChannel: this.props.currentChannel,
    isPrivateChannel: this.props.isPrivate,
    currentUser: this.props.currentUser,
    numberOfUniqueUsers: 0
  };

  componentDidMount() {
    const { currentChannel, currentUser } = this.state;
    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id);
    }
  }
  addListeners = channelId => {
    this.addMessagesListener(channelId);
  };
  addMessagesListener = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUsersOnCurrentChannel(loadedMessages);
    });
  };
  countUsersOnCurrentChannel = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.sender.name)) {
        acc.push(message.sender.name);
      }
      return acc;
    }, []);
    this.setState({ numberOfUniqueUsers: uniqueUsers.length });
  };

  displayMessages = messages => {
    return (
      messages.length > 0 &&
      messages.map(message => (
        <Message key={message.timestamp} message={message} currentUser={this.state.currentUser} />
      ))
    );
  };

  displayChannelName = channel => {
    return channel ? `${this.state.isPrivateChannel ? '@' : '#'}${channel.name}` : '';
  };

  setFilteredMessages = filteredMessages => this.setState({ filteredMessages });
  clearFilteredMessages = () => this.setState({ filteredMessages: [] });

  render() {
    const {
      messagesRef,
      messages,
      filteredMessages,
      currentChannel,
      currentUser,
      numberOfUniqueUsers,
      isPrivateChannel
    } = this.state;
    return (
      <React.Fragment>
        <MessageHeader
          channelName={this.displayChannelName(currentChannel)}
          numberOfUniqueUsers={numberOfUniqueUsers}
          messages={messages}
          setFilteredMessages={this.setFilteredMessages}
          clearFilteredMessages={this.clearFilteredMessages}
          isPrivateChannel={isPrivateChannel}
        />
        <Segment style={{ marginTop: '14px' }}>
          <Comment.Group className="messages">
            {filteredMessages.length > 0
              ? this.displayMessages(filteredMessages)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          messagesRef={messagesRef}
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
