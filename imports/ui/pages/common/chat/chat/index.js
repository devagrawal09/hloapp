import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Conversations } from '../../../../../api/messages';

import '../../../../shared-components/loading';
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
