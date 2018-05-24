import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './alert.html';

const show = new ReactiveVar( false );
const alert = new ReactiveVar('');
const alertClass = new ReactiveVar('');

export default ( msg, contextClass )=> {
    show.set( true );
    alert.set( msg );
    alertClass.set( contextClass ? contextClass : 'success' );
    Meteor.setTimeout(()=> { show.set( false ) }, 5000 );
}

Template.alert.helpers({
    show() {
        return show.get();
    },
    alert() {
        return alert.get();
    },
    alertClass() {
        return alertClass.get();
    }
});

Template.alert.events({
    'click .close'() {
        show.set( false );
    }
});
