import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Menu, Icon, Modal, Form, Input, ModalActions, Button, Label } from 'semantic-ui-react';
import { setCurrentChannel } from '../../actions/actions';

class Channels extends Component {
  state = {
    activeChannelId: '',
    activeChannel: null,
    user: this.props.currentUser,
    channels: [],
    channelName: '',
    channelDescription: '',
    channelsRef: firebase.database().ref('channels'),
    messagesRef: firebase.database().ref('messages'),
    notifications: [],
    modal: false,
    firstLoad: true // first time the application loads
  };

  componentDidMount() {
    this.addListeners();
  }
  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on('child_added', snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, this.setFirstChannel);
      this.addNotificationsListener(snap.key);
    });
  };
  setFirstChannel = () => {
    const { firstLoad, channels } = this.state;
    if (firstLoad && channels.length > 0) {
      const firstChannel = channels[0];
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };
  setActiveChannel = channel => {
    this.setState({ activeChannelId: channel.id, activeChannel: channel });
  };
  addNotificationsListener = channelId => {
    // prettier-ignore
    this.state.messagesRef.child(channelId).on('value', snap => {  
      if(this.state.activeChannel)
        this.handleNotifications(channelId, this.state.activeChannelId, this.state.notifications, snap)
    });
  };
  handleNotifications = (channelId, activeChannelId, notifications, snap) => {
    let index = notifications.findIndex(notification => notification.id === channelId);
    if (index !== -1) {
      const channel = notifications[index];
      if (channelId !== activeChannelId) {
        const numberOfNewMessages = snap.numChildren() - channel.totalNumOfMessages;
        if (numberOfNewMessages > 0) {
          channel.newMessagesCount = numberOfNewMessages;
        }
      }
      channel.lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        totalNumOfMessages: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        newMessagesCount: 0
      });
    }
    this.setState({ notifications });
  };

  componentWillUnmount() {
    this.removeListeners();
  }
  removeListeners = () => this.state.channelsRef.off();

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.createNewChannel();
    }
  };
  isFormValid = ({ channelName, channelDescription }) => channelName && channelDescription;
  createNewChannel = async () => {
    const { channelsRef, channelName, channelDescription, user } = this.state;
    const key = channelsRef.push().key; // generate a unique id for each channel
    const newChannel = {
      id: key,
      name: channelName,
      description: channelDescription,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    try {
      await channelsRef.child(key).update(newChannel);
      this.setState({ channelName: '', channelDescription: '' });
      this.closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  closeModal = () => this.setState({ modal: false });
  openModal = () => this.setState({ modal: true });

  // Functions below are used within render()
  handleChange = event => this.setState({ [event.target.name]: event.target.value });

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        style={{ opacity: 0.7 }}
        onClick={() => this.changeChannel(channel)}
        active={channel.id === this.state.activeChannelId}
      >
        {this.getNotificationsCount(channel) && (
          <Label color="red">{this.getNotificationsCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ));
  changeChannel = channel => {
    this.clearNotifications();
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };
  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.state.activeChannelId
    );
    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].totalNumOfMessages = this.state.notifications[index].lastKnownTotal;
      updatedNotifications[index].newMessagesCount = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };
  getNotificationsCount = channel => {
    let count = 0;
    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.newMessagesCount;
      }
    });
    if (count > 0) return count;
  };

  render() {
    const { channels, modal, channelName, channelDescription } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{' '}
            ({channels.length}) <Icon name="add" onClick={this.openModal} link />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>
        {/* Create New Channel Modal */}
        <Modal size="small" open={modal} onClose={this.closeModal} centered={false}>
          <Modal.Header>Create New Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  name="channelName"
                  onChange={this.handleChange}
                  value={channelName}
                  placeholder="Channel Name"
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  name="channelDescription"
                  onChange={this.handleChange}
                  value={channelDescription}
                  placeholder="About the channel"
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <ModalActions>
            <Button color="green" onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Create
            </Button>
            <Button color="red" onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </ModalActions>
        </Modal>
      </React.Fragment>
    );
  }
}

const actions = {
  setCurrentChannel // sets channel in Global state
};

export default connect(
  null,
  actions
)(Channels);
