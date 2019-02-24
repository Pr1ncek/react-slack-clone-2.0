import React, { Component } from 'react';
import { Segment, Accordion, Header, Icon, Image } from 'semantic-ui-react';

class MetaPanel extends Component {
  state = {
    activeIndex: 0,
    isPrivateChannel: this.props.isPrivate,
    currentChannel: this.props.currentChannel
  };

  setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex, isPrivateChannel, currentChannel } = this.state;
    if (isPrivateChannel) return null;

    return (
      <Segment style={{ marginTop: '10px' }} loading={!currentChannel}>
        <Header as="h3" attached="top" style={{ textAlign: 'center' }}>
          About #{currentChannel && currentChannel.name}
        </Header>
        <Accordion styled attached="true">
          <Accordion.Title active={activeIndex === 0} index={0} onClick={this.setActiveIndex}>
            <Icon name="dropdown" />
            <Icon name="info" />
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            {currentChannel && currentChannel.description}
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 1} index={1} onClick={this.setActiveIndex}>
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>posters</Accordion.Content>

          <Accordion.Title active={activeIndex === 2} index={2} onClick={this.setActiveIndex}>
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <Header as="h3">
              <Image src={currentChannel && currentChannel.createdBy.avatar} circular />
              {currentChannel && currentChannel.createdBy.name}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}
export default MetaPanel;
