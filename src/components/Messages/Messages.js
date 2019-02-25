import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { Segment, Comment } from 'semantic-ui-react';

import MessageHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

import { setUserPostsCount } from '../../actions/actions';

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    privateMessagesRef: firebase.database().ref('privateMessages'),
    messages: [],
    filteredMessages: [], // used for searching messages
    messagesLoading: true,
    currentChannel: this.props.currentChannel,
    isPrivateChannel: this.props.isPrivate,
    isFavoriteChannel: false,
    currentUser: this.props.currentUser,
    numberOfUniqueUsers: 0,
    usersRef: firebase.database().ref('users')
  };

  componentDidMount() {
    const { currentChannel, currentUser } = this.state;
    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id, currentUser.uid);
    }
  }
  addListeners = (channelId, currentUserId) => {
    this.addMessagesListener(channelId);
    this.addFavoritedChannelsListener(channelId, currentUserId);
  };
  addMessagesListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUsersOnCurrentChannel(loadedMessages);
      this.determineTopPostersOnChannel(loadedMessages);
    });
  };
  getMessagesRef = () => {
    const { isPrivateChannel, messagesRef, privateMessagesRef } = this.state;
    return isPrivateChannel ? privateMessagesRef : messagesRef;
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
  addFavoritedChannelsListener = (channelId, currentUserId) => {
    this.state.usersRef
      .child(currentUserId)
      .child('favorites')
      .once('value')
      .then(data => {
        if (data.val() !== null) {
          const favoritedChannelIds = Object.keys(data.val());
          this.setState({ isFavoriteChannel: favoritedChannelIds.includes(channelId) });
        }
      });
  };
  determineTopPostersOnChannel = messages => {
    let userPostsCount = messages.reduce((acc, message) => {
      if (message.sender.name in acc) {
        acc[message.sender.name].messageCount += 1;
      } else {
        acc[message.sender.name] = {
          avatar: message.sender.avatar,
          messageCount: 1
        };
      }
      return acc;
    }, {});
    this.props.setUserPostsCount(userPostsCount);
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

  setFavoriteChannel = () => {
    this.setState(
      prevState => ({ isFavoriteChannel: !prevState.isFavoriteChannel }),
      () => {
        this.saveFavoriteChannel();
      }
    );
  };
  saveFavoriteChannel = () => {
    const { currentUser, currentChannel, isFavoriteChannel, usersRef } = this.state;
    if (isFavoriteChannel) {
      usersRef.child(`${currentUser.uid}/favorites`).update({
        [currentChannel.id]: {
          name: currentChannel.name,
          description: currentChannel.description,
          createdBy: { ...currentChannel.createdBy }
        }
      });
    } else {
      usersRef
        .child(`${currentUser.uid}/favorites`)
        .child(currentChannel.id)
        .remove(error => {
          if (error) console.error(error);
        });
    }
  };

  render() {
    const {
      messagesRef,
      messages,
      filteredMessages,
      currentChannel,
      currentUser,
      numberOfUniqueUsers,
      isPrivateChannel,
      isFavoriteChannel
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
          setFavoriteChannel={this.setFavoriteChannel}
          isFavoriteChannel={isFavoriteChannel}
        />
        <Segment>
          <Comment.Group className="messages">
            {filteredMessages.length > 0
              ? this.displayMessages(filteredMessages)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <Segment>
          <MessageForm
            messagesRef={messagesRef}
            currentChannel={currentChannel}
            currentUser={currentUser}
            isPrivateChannel={isPrivateChannel}
            getMessagesRef={this.getMessagesRef}
          />
        </Segment>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { setUserPostsCount }
)(Messages);
