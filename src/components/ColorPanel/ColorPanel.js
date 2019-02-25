import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { Sidebar, Menu, Divider, Button, Icon, Modal, Label, Segment } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';

import { setApplicationColors } from '../../actions/actions';

class ColorPanel extends Component {
  state = {
    modal: false,
    primary: '#2d3886',
    secondary: '#40bf9a',
    colors: [],
    currentUser: this.props.currentUser,
    usersRef: firebase.database().ref('users')
  };

  componentDidMount() {
    if (this.state.currentUser) {
      this.addListeners(this.state.currentUser.uid);
    }
  }
  addListeners = currentUserId => {
    let colors = [];
    this.state.usersRef.child(`${currentUserId}/colors`).on('child_added', snap => {
      colors.unshift(snap.val());
      this.setState({ colors });
    });
  };

  closeModal = () => this.setState({ modal: false });
  openModal = () => this.setState({ modal: true });

  handleChangePrimary = color => this.setState({ primary: color.hex });
  handleChangeSecondary = color => this.setState({ secondary: color.hex });

  saveColors = () => {
    const { primary, secondary, usersRef, currentUser } = this.state;
    if (primary && secondary) {
      usersRef
        .child(`${currentUser.uid}/colors`)
        .push()
        .update({
          primary,
          secondary
        })
        .then(() => {
          this.closeModal();
        });
    }
  };

  displayColors = colors => {
    return (
      colors.length > 0 &&
      colors.map((color, index) => (
        <React.Fragment key={index}>
          <Divider />
          <div
            className="color__container"
            onClick={() => this.setColors(color.primary, color.secondary)}
          >
            <div className="color__square" style={{ background: color.primary }}>
              <div className="color__overlay" style={{ background: color.secondary }} />
            </div>
          </div>
        </React.Fragment>
      ))
    );
  };

  setColors = (primary, secondary) => {
    this.props.setApplicationColors(primary, secondary);
  };

  render() {
    const { modal, primary, secondary, colors } = this.state;
    return (
      <Sidebar as={Menu} inverted vertical visible width="very thin" name="labeled">
        <Divider />
        <Button icon="add" size="small" color="blue" onClick={this.openModal} />
        {this.displayColors(colors)}
        {/* Color Picker Modal */}
        <Modal open={modal} onClose={this.closeModal} centered={false}>
          <Modal.Header>Choose App Colors</Modal.Header>
          <Modal.Content>
            <Segment>
              <Label>Primary Color</Label>
              <SliderPicker onChange={this.handleChangePrimary} color={primary} />
            </Segment>
            <Segment>
              <Label>Secondary Color</Label>
              <SliderPicker onChange={this.handleChangeSecondary} color={secondary} />
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={this.saveColors}>
              <Icon name="checkmark" /> Save Colors
            </Button>
            <Button color="red" onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

export default connect(
  null,
  { setApplicationColors }
)(ColorPanel);
