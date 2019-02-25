import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Favorites from './Favorites';

class SidePanel extends Component {
  render() {
    const { currentUser, primaryColor } = this.props;
    return (
      <Menu
        size="large"
        vertical
        fixed="left"
        inverted
        style={{ backgroundColor: primaryColor, fontSize: '1.2rem' }}
      >
        <UserPanel currentUser={currentUser} primaryColor={primaryColor} />
        <Favorites currentUser={currentUser} />
        <Channels currentUser={currentUser} />
        <DirectMessages currentUser={currentUser} />
      </Menu>
    );
  }
}

export default SidePanel;
