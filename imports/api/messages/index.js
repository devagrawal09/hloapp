import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'mdg:validated-method';

import { messageSchema } from './schema.js';

export const Messages = new Mongo.Collection('msg');
export const Conversations = new Mongo.Collection('conversations');

export const newMsg = new ValidatedMethod({ //send a new message
    name: 'msg.new',
    validate: messageSchema.pick('to', 'msg').validator(),
    run( msg ) {

        msg.from = this.userId;
        msg.sent = new Date();              //set message sent date
        msg.read = false;                   //all messages are unread by default

        let result = Conversations.findOne({//fetch conversation
            $and: [{ participants: msg.from }, { participants: msg.to }]
        });

        if ( !result ) {            //this conversation doesn't exist, create one
            Conversations.insert({
                participants: [ msg.from, msg.to ],
                last: msg
            }, function(err, id) {
                msg.conversation = id;  //set conversation id
                Messages.insert(msg);   //send message
            });
            return ;
        }

        Conversations.update( result._id, { //this conversation exists
            $set: { last: msg }
        });

        msg.conversation = result._id;  //set conversation id
        Messages.insert(msg);           //send message
        return ;
    }
});

export const readMsg = new ValidatedMethod({    //set messages as read of a conversation
    name: 'msg.read',
    validate: messageSchema.pick('conversation').validator(),
    run({ conversation }) {     //only conversation id needed

        Messages.update({
            conversation,
            to: this.userId,    //fetch messages sent to current user
            read: false         //fetch only the unread messages
        }, {
            $set: { read: true }
        }, {
            multi: true         //modify all matching docs
        });
    }
});
