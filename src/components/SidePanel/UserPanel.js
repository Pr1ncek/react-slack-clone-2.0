import React, { Component } from 'react';
import firebase from '../../firebase';

import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';

class UserPanel extends Component {
  state = {
    user: this.props.currentUser
  };

  dropdownOptions = () => [
    {
      key: 'user',
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
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
    const { user } = this.state;
    const { primaryColor } = this.props;
    return (
      <Grid style={{ backgroundColor: primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            {/* App Header */}
            <Header inverted as="h2" floated="left" style={{ paddingBottom: '20px' }}>
              <Icon name="code" />
              <Header.Content>Messenger</Header.Content>
            </Header>
            {/* User Dropdown */}
            <Header as="h4" inverted style={{ paddingBottom: '20px' }}>
              <Dropdown
                trigger={
                  <span>
                    <Image src={user.photoURL} avatar spaced="right" />
                    {user.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
