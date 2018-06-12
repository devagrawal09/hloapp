import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';

import { contactSchema, contactUs } from '../../../../api/public';

import showAlert from '../../../shared-components/alert';
import './contact.html';

Template.Contact.helpers({
    schema: contactSchema
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
