import React, { Component } from 'react';
import firebase from '../../firebase';
import { Menu, Icon } from 'semantic-ui-react';

class DirectMessages extends Component {
  state = {
    currentUser: this.props.currentUser,
    users: [],
    usersRef: firebase.database().ref('users'),
    connectedRef: firebase.database().ref('.info/connected'),
    presenceRef: firebase.database().ref('presence')
  };

  componentDidMount() {
    if (this.state.currentUser) {
      this.addListeners(this.state.currentUser.uid);
    }
  }
  addListeners = currentUserId => {
    let loadedUsers = [];
    this.state.usersRef.on('child_added', snap => {
      if (currentUserId !== snap.key) {
        let user = snap.val();
        user['uid'] = snap.key;
        user['status'] = 'offline';
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    });

    this.state.connectedRef.on('value', snap => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserId);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err) console.error(err);
        });
      }
    });

    this.state.presenceRef.on('child_added', snap => {
      if (currentUserId !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on('child_removed', snap => {
      if (currentUserId !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  render() {
    const { users } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{' '}
          ({users.length})
        </Menu.Item>
        {users.length > 0 &&
          users.map(user => (
            <Menu.Item key={user.uid} style={{ opacity: 0.7, fontStyle: 'italic' }}>
              <Icon name="circle" color={user.status === 'online' ? 'green' : 'red'} />@ {user.name}
            </Menu.Item>
          ))}
      </Menu.Menu>
    );
  }
}

export default DirectMessages;