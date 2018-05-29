import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';

import { messageSchema } from '../../../api/messages/schema.js';

import showAlert from '../alert';

import './compose-modal.html';

Template.composeMsg.helpers({
    composeSchema: messageSchema.pick('recipient', 'subject', 'msg')
});

AutoForm.hooks({
    newConversation: {
        after: { method( err, res ) {
            if( err ) {
                showAlert( err.reason, 'danger');
            } else {
                showAlert('Message sent successfully!');
                $('#compose').modal('hide');
            }
        }}
    }
});
