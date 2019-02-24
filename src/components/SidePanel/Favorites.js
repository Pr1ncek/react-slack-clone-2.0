import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';
import { setCurrentChannel, setPrivateChannel } from '../../actions/actions';

class Favorites extends Component {
  state = {
    currentUser: this.props.currentUser,
    usersRef: firebase.database().ref('users'),
    activeChannelId: '',
    favoriteChannels: []
  };

  componentDidMount() {
    this.addListeners();
  }
  addListeners = () => {
    const { currentUser, usersRef } = this.state;
    usersRef
      .child(currentUser.uid)
      .child('favorites')
      .on('child_added', snap => {
        const favoritedChannel = { id: snap.key, ...snap.val() };
        this.setState({ favoriteChannels: [...this.state.favoriteChannels, favoritedChannel] });
      });

    usersRef
      .child(currentUser.uid)
      .child('favorites')
      .on('child_removed', snap => {
        const filteredChannels = this.state.favoriteChannels.filter(channel => channel.id !== snap.key);
        this.setState({ favoriteChannels: filteredChannels });
      });
  };

  displayChannels = favoriteChannels =>
    favoriteChannels.length > 0 &&
    favoriteChannels.map(channel => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        style={{ opacity: 0.7 }}
        onClick={() => this.changeChannel(channel)}
      >
        # {channel.name}
      </Menu.Item>
    ));
  changeChannel = channel => {
    this.setActiveChannelId(channel.id);
    this.props.setCurrentChannel(channel);
  };
  setActiveChannelId = channelId => {
    this.setState({ activeChannelId: channelId });
  };

  render() {
    const { favoriteChannels } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="heart" color="red" /> FAVORITES
          </span>{' '}
          ({favoriteChannels.length})
        </Menu.Item>
        {this.displayChannels(favoriteChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel }
)(Favorites);
