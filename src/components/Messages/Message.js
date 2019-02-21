import React from 'react';
import moment from 'moment';
import { Comment, Image } from 'semantic-ui-react';

const isOwnMessage = (senderId, currentUserId) => {
  return senderId === currentUserId ? 'message__self' : '';
};

const timeFromNow = timestamp => {
  return moment(timestamp).fromNow();
};

const isImage = message => {
  return message.hasOwnProperty('image') && !message.hasOwnProperty('content');
};

const Message = ({ message, currentUser }) => {
  return (
    <Comment style={{ paddingBottom: '5px' }}>
      <Comment.Avatar src={message.sender.avatar} />
      <Comment.Content className={isOwnMessage(message.sender.id, currentUser.uid)}>
        <Comment.Author as="a">{message.sender.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
        {isImage(message) ? (
          <Image
            src={message.image}
            className="message__image"
            style={{ marginTop: '5px', width: '75%' }}
          />
        ) : (
          <Comment.Text style={{ paddingTop: '5px', fontSize: '1.15rem' }}>
            {message.content}
          </Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};

export default Message;
