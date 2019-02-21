import React, { Component } from 'react';
import mime from 'mime-types';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';

class FileModal extends Component {
  state = {
    imageFile: null,
    validFileTypes: ['image/jpeg', 'image/png']
  };

  saveImageInState = event => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      this.setState({ imageFile });
    }
  };

  sendImage = () => {
    const { imageFile } = this.state;
    const { uploadImageFile, closeModal } = this.props;
    if (imageFile !== null) {
      if (this.isValidFileType(imageFile.name)) {
        const metadata = { contentType: mime.lookup(imageFile.name) };
        uploadImageFile(imageFile, metadata);
        closeModal();
        this.clearFileFromState();
      }
    }
  };
  isValidFileType = fileName => {
    return this.state.validFileTypes.includes(mime.lookup(fileName));
  };
  clearFileFromState = () => this.setState({ imageFile: null });

  render() {
    const { modal, closeModal, uploadingImage } = this.props;
    return (
      <Modal
        size="small"
        open={modal}
        onClose={closeModal}
        centered={false}
        closeOnEscape={false}
        closeOnDimmerClick={false}
      >
        <Modal.Header>Select Image</Modal.Header>
        <Modal.Content>
          <Input
            style={{ width: '100%' }}
            type="file"
            name="imageFile"
            label="File Types: JPEG, PNG"
            onChange={this.saveImageInState}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            onClick={this.sendImage}
            loading={uploadingImage}
            disabled={uploadingImage}
          >
            <Icon name="send" /> Send Message
          </Button>
          <Button color="red" onClick={closeModal} disabled={uploadingImage}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
