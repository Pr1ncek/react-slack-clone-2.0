import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Icon } from 'semantic-ui-react';

class ColorPanel extends Component {
  render() {
    return (
      <Sidebar as={Menu} inverted vertical visible width="very thin" name="labeled">
        <Divider />
        <Button icon="add" size="small" color="blue" />
      </Sidebar>
    );
  }
}

export default ColorPanel;
