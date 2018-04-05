import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

export const messageSchema = new SimpleSchema({
    from: Datatypes.Id,
    to: Datatypes.Id,
    msg: String,
    sent: Date,
    read: Boolean
});