import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
// Components
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

import './App.css';

function App({
  currentUser,
  currentChannel,
  isPrivate,
  userPostsCount,
  primaryColor,
  secondaryColor
}) {
  return (
    <Grid
      columns="equal"
      style={{ backgroundColor: secondaryColor, height: '100vh', margin: 0, width: '100vw' }}
    >
      <ColorPanel currentUser={currentUser} key={currentUser && currentUser.name} />
      <SidePanel
        currentUser={currentUser}
        key={currentUser && currentUser.uid}
        primaryColor={primaryColor}
      />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          currentUser={currentUser}
          currentChannel={currentChannel}
          isPrivate={isPrivate}
          key={currentChannel && currentChannel.id}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel
          currentUser={currentUser}
          currentChannel={currentChannel}
          isPrivate={isPrivate}
          userPostsCount={userPostsCount}
          key={currentChannel && currentChannel.name}
        />
      </Grid.Column>
    </Grid>
  );
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivate: state.channel.isPrivate,
  userPostsCount: state.channel.userPostsCount,
  primaryColor: state.colors.primaryColor,
  secondaryColor: state.colors.secondaryColor
});

export default connect(mapStateToProps)(App);
