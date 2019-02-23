import React from 'react';
import uuidv4 from 'uuid/v4';
import firebase from '../../firebase';
import { Segment, Button, Input } from 'semantic-ui-react';

import FileModal from './FileModal';

class MessageForm extends React.Component {
  state = {
    storageRef: firebase.storage().ref(),
    message: '',
    currentChannel: this.props.currentChannel,
    currentUser: this.props.currentUser,
    sending: false,
    modal: false,
    uploadingImage: false,
    uploadTask: null
  };

  closeModal = () => this.setState({ modal: false });
  openModal = () => this.setState({ modal: true });

  handleChange = event => this.setState({ [event.target.name]: event.target.value });

  sendMessage = async () => {
    const messagesRef = this.props.getMessagesRef();
    const { message, currentChannel } = this.state;
    try {
      if (message && message.trim().length > 0) {
        this.setState({ sending: true });
        await messagesRef
          .child(currentChannel.id)
          .push()
          .set(this.createMessage());
        this.setState({ message: '' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ sending: false });
    }
  };
  createMessage = (imageFileUrl = null) => {
    const { currentUser, message } = this.state;
    const newMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      sender: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };
    if (imageFileUrl) {
      newMessage['image'] = imageFileUrl;
    } else {
      newMessage['content'] = message;
    }
    return newMessage;
  };

  uploadImageFile = async (imageFile, metadata) => {
    const messagesRef = this.props.getMessagesRef();
    const pathToUpload = this.state.currentChannel.id;
    const filePath = `${this.createPath()}${uuidv4()}.jpg`;
    try {
      await this.setState({
        uploadingImage: true,
        uploadTask: this.state.storageRef.child(filePath).put(imageFile, metadata)
      });
      this.state.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, async snap => {
        const downloadUrl = await this.state.uploadTask.snapshot.ref.getDownloadURL();
        this.sendImageMessage(downloadUrl, messagesRef, pathToUpload);
      });
    } catch (error) {
      console.error(error, error.message);
    }
  };
  createPath = () => {
    this.props.isPrivateChannel ? `chat/private-${this.state.currentChannel.id}` : 'chat/public';
  };
  sendImageMessage = async (imageFileUrl, messagesRef, pathToUpload) => {
    try {
      await messagesRef
        .child(pathToUpload)
        .push()
        .set(this.createMessage(imageFileUrl));
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ uploadingImage: false }); // Completion of Uploading and Sending image
    }
  };

  render() {
    const { message, sending, modal, uploadingImage } = this.state;
    return (
      <Segment className="message__form" style={{ padding: '20px' }}>
        <Input
          fluid
          name="message"
          style={{ marginBottom: '0.7em' }}
          label={<Button icon="smile outline" />}
          placeholder="Write Your Message"
          value={message}
          onChange={this.handleChange}
        />
        <Button.Group icon widths="2">
          <Button
            style={{ padding: '10px' }}
            color="blue"
            content="Send Message"
            labelPosition="left"
            icon="send"
            fluid
            onClick={this.sendMessage}
            loading={sending || uploadingImage}
            disabled={sending || uploadingImage}
          />
          <Button
            color="red"
            content="Upload Media"
            labelPosition="left"
            icon="cloud upload"
            fluid
            onClick={this.openModal}
            disabled={uploadingImage}
          />
          <FileModal
            modal={modal}
            closeModal={this.closeModal}
            uploadImageFile={this.uploadImageFile}
            uploadingImage={uploadingImage}
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;
