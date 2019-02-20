import React, { Component } from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

class MessagesHeader extends Component {
  render() {
    return (
      <Segment clearing>
        {/* Channel Title */}
        <Header floated="left" fluid="true" as="h2" style={{ marginBottom: 0 }}>
          <span>
            Channel <Icon name="star outline" color="black" />
          </span>
          <Header.Subheader>2 users</Header.Subheader>
        </Header>

        {/* Channel Search Input */}
        <Header floated="right">
          <Input size="small" icon="search" name="searchTerm" placeholder="Search Messages" />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
