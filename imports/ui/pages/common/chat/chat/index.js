import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';

import { Conversations, newMsg } from '../../../../../api/messages';
import { messageSchema } from '../../../../../api/messages/schema.js';

import showAlert from '../../../../shared-components/alert';
import '../../../../shared-components/compose-modal';
import './chat.html';

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('conversations');
    Package['msavin:mongol'].Mongol.showCollection('msg');
}

Template.Chat.onCreated(function() {
    this.subscribe('conversations');
});

Template.Chat.helpers({ 
    conversations() { 
        return Conversations.find({ participants: Meteor.userId() }, {
            sort: { last: -1 }
        });
    },
    msgDate( date ) {
        let now = new Date()
        if( date.toDateString() === now.toDateString() ) 
        return date.toTimeString().substr(0,5);
        return date.toDateString();
    }
});
