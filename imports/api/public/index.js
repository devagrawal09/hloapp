import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

export const contactSchema = new SimpleSchema({
    name: String,
    email: SimpleSchema.RegEx.EmailWithTLD,
    text: {
        type: String,
        label: 'Message'
    }
});

export const contactUs = new ValidatedMethod({
    name: 'contact',
    validate: contactSchema.validator(),
    run({ name, email, text }) {

        if( !this.isSimulation )
        Email.send({
            replyTo: email,
            to: 'info@healthylovedones.com',          
            subject: `${name} contacted HLO!`,
            text: `
                ${name} contacted HLO through the website!
                Email id - ${email},
                Message - ${text}
            `
        });

        return true;
    }
});
