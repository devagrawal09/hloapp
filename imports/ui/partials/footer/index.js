import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './footer.html';
import './copyright.html';

const texts = new ReactiveVar({});

Template.Footer.onCreated(function () {
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

Template.Footer.helpers({
    texts() {
        return texts.get();
    }
});

Template.copyright.helpers({
    texts() {
        return texts.get();
    }
})