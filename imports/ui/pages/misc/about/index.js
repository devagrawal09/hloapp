import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

const texts = new ReactiveVar({});

import './style.css';
import './about.html';

Template.About.onCreated(function() {
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

Template.About.onRendered(function() {
    this.$('.slider-wrapper').append(`
        <script type="text/javascript" src="/js/wowslider.js"></script>
        <script type="text/javascript" src="/js/script.js"></script>
    `);
});

Template.About.helpers({
    texts() {
        return texts.get();
    }
});
