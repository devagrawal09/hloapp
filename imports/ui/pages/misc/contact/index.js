import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { ReactiveVar } from 'meteor/reactive-var';

import { contactSchema, contactUs } from '../../../../api/public';

import showAlert from '../../../shared-components/alert';
import './contact.html';

const texts = new ReactiveVar({});

Template.Contact.onCreated(function() {
    this.autorun(()=> {
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

Template.Contact.helpers({
    schema: contactSchema,
    texts() {
        return texts.get();
    }
});

AutoForm.hooks({
    'contact-us': { onSubmit( doc ) {
        contactUs.call( doc, ( err, res )=> {
            console.log( err, res );
            if( err ) {
                showAlert( err.reason, 'danger');
            } else {
                showAlert('Message sent successfully!');
            }
        });
        return false;
    }}
})
