import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

export const messageSchema = new SimpleSchema({
    _id: Datatypes.Id,
    from: Datatypes.Id,
    to: Datatypes.Id,
    recipient: String,
    msg: {
        type: String,
        label: 'Message'
    },
    conversation: Datatypes.Id,
    sent: Date,
    read: Boolean,
    subject: String
});

export const conversationSchema = new SimpleSchema({    //only for reference
    _id: Datatypes.Id,
    subject: String,
    participants: Array,
    'participants.$': Datatypes.Id
});
