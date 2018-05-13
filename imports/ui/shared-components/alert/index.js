import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './alert.html';

const show = new ReactiveVar( false );
const alert = new ReactiveVar('');

export default ( msg )=> {
    show.set( true );
    alert.set( msg );
    Meteor.setTimeout(()=> { show.set( false ) }, 5000 );
}

Template.alert.helpers({
    show() {
        return show.get();
    },
    alert() {
        return alert.get();
    }
});

Template.alert.events({
    'click .close'() {
        show.set( false );
    }
});
