import React, { Component } from 'react';
import firebase from '../../firebase';
import { Grid, Header, Icon, Dropdown } from 'semantic-ui-react';

export default class UserPanel extends Component {
  dropdownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>User</strong>
        </span>
      ),
      disabled: true
    },
    { key: 'avatar', text: <span>Change Avatar</span> },
    { key: 'signout', text: <span onClick={this.handleSignout}>Sign Out</span> }
  ];

  handleSignout = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <Grid style={{ backgroundColor: '#4c3c4c' }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            {/* App Header */}
            <Header inverted as="h2" floated="left">
              <Icon name="code" />
              <Header.Content>Messenger</Header.Content>
            </Header>
          </Grid.Row>

          {/* User Dropdown */}
          <Header as="h4" inverted style={{ padding: '.25em' }}>
            <Dropdown trigger={<span>User</span>} options={this.dropdownOptions()} />
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}
