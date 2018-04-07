import { Meteor } from 'meteor/meteor';

import { Messages, Conversations } from '..';

Meteor.publish('conversations', function(){
    return Conversations.find({
        participants: this.userId
    });
});

Meteor.publish('conversation', function( conversation ){
    return Messages.find({
        conversation,
        $or: [{ to: this.userId }, { from: this.userId }]
    });
});
