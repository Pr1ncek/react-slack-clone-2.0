import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
// Components
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

function App({ currentUser }) {
  return (
    <Grid columns="equal" style={styles}>
      <ColorPanel />
      <SidePanel currentUser={currentUser} />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
}

const styles = {
  backgroundColor: '#eee',
  height: '100vh',
  padding: '1rem'
};

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

export default connect(mapStateToProps)(App);
