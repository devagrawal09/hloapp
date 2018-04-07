import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

export const messageSchema = new SimpleSchema({
    _id: Datatypes.Id,
    from: Datatypes.Id,
    to: Datatypes.Id,
    msg: String,
    conversation: Datatypes.Id,
    sent: Date,
    read: Boolean
});

export const conversationSchema = new SimpleSchema({    //only for reference
    _id: Datatypes.Id,
    participants: Array,
    'participants.$': Datatypes.Id,
    last: messageSchema     //store the contents of the last message to display
});
