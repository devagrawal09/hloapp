import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Conversations, Messages, reply, readMsg } from '../../../../../api/messages';

import showAlert from '../../../../shared-components/alert';
import '../../../../shared-components/loading';
import './conversation.html';

Template.Conversation.onCreated(function() {
    this.autorun(()=> {
        this.subscribe('conversation', Template.currentData().conversation(), 10);
    });
});

Template.Conversation.onRendered(function() {
    readMsg.call({ conversation: Template.currentData().conversation() });
});

Template.Conversation.helpers({
    messages() {
        let conversation = Template.currentData().conversation();
        return Messages.find({ conversation }, {
            sort: { sent: 1 }
        });
    },
    msgDate( date ) {
        let now = new Date()
        if( date.toDateString() === now.toDateString() ) 
        return date.toTimeString().substr(0,5);
        return date.toDateString();
    },
    conversation() {
        let id = Template.currentData().conversation();
        return Conversations.findOne( id );
    }
});

Template.Conversation.events({ 
    'submit #reply'( e, t ) {

        e.preventDefault();
        e.stopPropagation();
        
        reply.call({
            msg: e.target.msg.value,
            conversation: t.data.conversation()
        }, ( err, res )=> {
            if( err ) { showAlert( err.reason, 'danger'); }
            else { e.target.msg.value = ''; }
        });
    } 
});
