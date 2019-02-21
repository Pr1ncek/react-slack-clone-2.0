import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
// Components
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

import './App.css';

function App({ currentUser, currentChannel }) {
  return (
    <Grid columns="equal">
      <ColorPanel />
      <SidePanel currentUser={currentUser} key={currentUser && currentUser.uid} />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          currentUser={currentUser}
          currentChannel={currentChannel}
          key={currentChannel && currentChannel.id}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
});

export default connect(mapStateToProps)(App);
