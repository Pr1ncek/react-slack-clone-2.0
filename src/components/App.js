import React from 'react';
import { Grid } from 'semantic-ui-react';
// Components
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

function App() {
  return (
    <Grid columns="equal" style={styles}>
      <ColorPanel />
      <SidePanel />
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

export default App;
