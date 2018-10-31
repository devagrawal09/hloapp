import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './account.html';

const texts = new ReactiveVar({});

Template.Account.onCreated(function () {
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

Template.Account.helpers({
    texts() {
        return texts.get();
    }
});
