import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { T9n } from 'meteor-accounts-t9n';
import './radio-inline-template.html';

Template.atRadioInputInline.replaces('atRadioInput');

Template.body.onRendered(function() {
    $('body').append(`<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=7d82c0a9-aa1f-41cf-9544-cc628fbd2ac4"></script>`);
});

T9n.setTracker({Tracker});
T9n.map('en', require('./en.js').texts );
T9n.map('zh_hk', require('./tc.js').texts );


Tracker.autorun(function() {
    let lang = Session.get('lang');
    if( lang === 'tc' ) T9n.setLanguage('zh_hk');
    else T9n.setLanguage('en');
});