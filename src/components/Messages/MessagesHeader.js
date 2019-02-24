import React, { Component } from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

class MessagesHeader extends Component {
  state = {
    searching: false,
    searchTerm: ''
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value, searching: true }, () => {
      if (this.state.searchTerm && this.state.searchTerm.trim().length > 0) {
        this.searchMessages();
      } else {
        this.props.clearFilteredMessages();
        this.setState({ searching: false });
      }
    });
  };

  searchMessages = () => {
    const messages = [...this.props.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const filteredMessages = messages.reduce((acc, message) => {
      if ((message.content && message.content.match(regex)) || message.sender.name.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.props.setFilteredMessages(filteredMessages);
    setTimeout(() => this.setState({ searching: false }), 1000);
  };

  render() {
    const {
      channelName,
      numberOfUniqueUsers = 0,
      isPrivateChannel,
      setFavoriteChannel,
      isFavoriteChannel
    } = this.props;
    const { searchTerm, searching } = this.state;
    return (
      <Segment clearing>
        {/* Channel Title */}
        <Header floated="left" fluid="true" as="h2" style={{ marginBottom: 0 }}>
          <span>
            {channelName}{' '}
            {!isPrivateChannel && (
              <Icon
                link
                name={isFavoriteChannel ? 'heart' : 'heart outline'}
                color="red"
                onClick={setFavoriteChannel}
              />
            )}
          </span>
          <Header.Subheader>
            {numberOfUniqueUsers === 1 ? `${numberOfUniqueUsers} user` : `${numberOfUniqueUsers} users`}
          </Header.Subheader>
        </Header>

        {/* Channel Search Input */}
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            loading={searching}
            name="searchTerm"
            placeholder="Messages & Users"
            onChange={this.handleChange}
            value={searchTerm}
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
