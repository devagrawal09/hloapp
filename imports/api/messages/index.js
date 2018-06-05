import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { messageSchema } from './schema.js';

export const Messages = new Mongo.Collection('msg');
export const Conversations = new Mongo.Collection('conversations');

export const newConversation = new ValidatedMethod({ //send a new message
    name: 'msg.new',
    validate: messageSchema.pick('recipient', 'msg', 'subject').validator(),
    run( msg ) {

        if ( !this.isSimulation ) {             //happens on the server

            //search for recipient
            const recipient = Meteor.users.findOne({
                $or: [{
                    _id: msg.recipient
                }, {
                    username: msg.recipient
                }, {
                    emails: { address: msg.recipient, verified: true }
                }]
            });

            if ( !recipient ) {
                throw new Meteor.Error('msg.new.error',
                'This recipient does not exist!');
            }

            if( recipient._id === this.userId ) {
                throw new Meteor.Error('msg.new.error', 
                'You cannot message yourself!');
            }

            msg.to = recipient._id;
            msg.from = this.userId;
            msg.sent = new Date();          //set message sent date
            msg.read = false;               //all messages are unread by default

            const id = Conversations.insert({
                participants: [msg.from, msg.to],
                subject: msg.subject,
                last: msg.sent
            });

            msg.conversation = id;          //set conversation id
            Messages.insert(msg);           //send message

            return true;
        }
    }
});

export const reply = new ValidatedMethod({
    name: 'msg.reply',
    validate: messageSchema.pick('msg', 'conversation').validator(),
    run( msg ) {

        let conversation = Conversations.findOne({    //fetch conversation
            _id: msg.conversation,
            participants: this.userId
        });

        if( !conversation ) {
            throw new Meteor.Error('msg.reply.error', 
            'This conversation does not exist!');
        }

        const fromIndex = _.indexOf( conversation.participants, this.userId );
        const toIndex = fromIndex? 0 : 1;

        msg.to = conversation.participants[toIndex];
        msg.from = this.userId;
        msg.sent = new Date();                  //set message sent date
        msg.read = false;                       //all messages are unread by default
        msg.conversation = conversation._id;    //set conversation id

        Messages.insert( msg );                 //send message
        Conversations.update( conversation._id, {
            $set: { last: msg.sent }
        });

        return true;
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

Conversations.helpers({
    otherParticipant() {
        const fromIndex = _.indexOf( this.participants, Meteor.userId() );
        const toIndex = fromIndex? 0 : 1;
        return Meteor.users.findOne( this.participants[toIndex] );
    },
    lastMsg() {
        return Messages.findOne({
            conversation: this._id
        }, {
            sort: { sent: -1 }
        });
    },
    isRead() {
        let last = this.lastMsg();
        return ( last.from === Meteor.userId() ) || last.read ;
    },
});

Messages.helpers({
    fromUser() {
        return Meteor.users.findOne( this.from );
    }
});
