import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';

class SidePanel extends Component {
  render() {
    return (
      <Menu
        size="large"
        vertical
        fixed="left"
        inverted
        style={{ backgroundColor: '#4c3c4c', fontSize: '1.2rem' }}
      >
        <UserPanel />
      </Menu>
    );
  }
}

export default SidePanel;
