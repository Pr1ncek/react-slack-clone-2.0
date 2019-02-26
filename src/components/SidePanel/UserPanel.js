import React, { Component } from 'react';
import firebase from '../../firebase';
import AvatarEditor from 'react-avatar-editor';
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImageUrl: '',
    blob: '',
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref('users'),
    metaData: { contentType: 'image/jpeg' },
    uploadedImageUrl: ''
  };

  closeModal = () => this.setState({ modal: false });
  openModal = () => this.setState({ modal: true });

  handleChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };

  handleCropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          croppedImageUrl: imageUrl,
          blob
        });
      });
    }
  };

  uploadCroppedImage = () => {
    const { userRef, storageRef, blob, metaData } = this.state;
    storageRef
      .child(`avatars/user-${userRef.uid}`)
      .put(blob, metaData)
      .then(snap => {
        snap.ref.getDownloadURL().then(downloadUrl => {
          this.setState({ uploadedImageUrl: downloadUrl }, () => this.changeAvatar());
        });
      });
  };
  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadedImageUrl
      })
      .then(() => {
        this.closeModal();
      })
      .catch(err => console.error(err));

    this.state.usersRef
      .child(this.state.userRef.uid)
      .update({
        avatar: this.state.uploadedImageUrl
      })
      .then(() => console.log('User avatar updated in DB!'))
      .catch(err => console.error(err));
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
    { key: 'avatar', text: <span onClick={this.openModal}>Change Avatar</span> },
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
    const { user, modal, previewImage, croppedImageUrl } = this.state;
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
                    <Image src={user.photoURL} circular style={{ width: '50px' }} spaced="right" />
                    {user.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
          {/* Change User Avatar Modal */}
          <Modal size="small" open={modal} onClose={this.closeModal} centered={false}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input
                type="file"
                fluid
                name="previewImage"
                label="File Types: JPG, PNG"
                onChange={this.handleChange}
              />
              <Grid stackable centered columns={2} style={{ margin: '10px' }}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">
                    {/* Image Preview */}
                    {previewImage && (
                      <AvatarEditor
                        ref={node => (this.avatarEditor = node)}
                        image={previewImage}
                        scale={1.2}
                        width={130}
                        height={130}
                        border={50}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {croppedImageUrl && (
                      <Image
                        src={croppedImageUrl}
                        style={{ margin: '3em auto' }}
                        width={120}
                        height={120}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImageUrl && (
                <Button color="blue" onClick={this.uploadCroppedImage}>
                  <Icon name="checkmark" /> Change Avatar
                </Button>
              )}
              <Button color="green" onClick={this.handleCropImage}>
                <Icon name="image" /> Preview
              </Button>
              <Button color="red" onClick={this.closeModal}>
                <Icon name="remove" /> Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
