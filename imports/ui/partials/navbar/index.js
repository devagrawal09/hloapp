import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import './navbar.html';

const texts = new ReactiveVar({});

Template.Navbar.onCreated(function () {
    this.autorun( ()=> {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            import(`./tc.js`).then( i => {
                texts.set( i.texts );
            });
        else
            import(`./en.js`).then( i => {
                texts.set( i.texts );
            });
    });
});

Template.Navbar.helpers({
    texts() {
        return texts.get();
    },
    isTc() {
        let lang = Session.get('lang');
        if( lang === 'tc' ) return true;
    }
});

Template.Navbar.events({
    'click .logout'() {
        AccountsTemplates.logout();
    }
});
