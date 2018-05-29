import { Meteor } from 'meteor/meteor';

import { Messages, Conversations } from '..';

Meteor.publishComposite('conversations', {
    find() {
        return Conversations.find({
            participants: this.userId
        });
    },
    children: [{
        find( conversation ) {
            return Messages.find({
                conversation: conversation._id,
                $or: [{ to: this.userId }, { from: this.userId }]
            }, {
                sort: { sent: -1 },
                limit: 1
            });
        }
    }, {
        find( conversation ) {
            return Meteor.users.find({
                _id: { $in: conversation.participants }
            }, { fields: {
                fullName: 1
            }});
        }
    }]
});

Meteor.publishComposite('conversation', function( _id, limit ){
    return {
        find() {
            return Conversations.find({
                _id,
                participants: this.userId
            });
        },
        children: [{
            find( conversation ) {
                return Messages.find({
                    conversation: conversation._id,
                    $or: [{ to: this.userId }, { from: this.userId }]
                }, {
                    sort: { sent: -1 },
                    limit
                });
            }
        }, {
            find( conversation ) {
                return Meteor.users.find({
                    _id: { $in: conversation.participants }
                }, { fields: {
                    fullName: 1
                }});
            }
        }]
    }
});
