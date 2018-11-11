import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { AutoForm } from 'meteor/aldeed:autoform';
import { ReactiveVar } from 'meteor/reactive-var';

import {
     sendVerificationEmail,
     modifyEmail, 
     newMobile, 
     verifyMobile,
     removeMobile 
} from '../../../../api/users';

import SimpleSchema from 'simpl-schema';
import showAlert from '../../../shared-components/alert';

import './username.html';
import './emails.html';
import './numbers.html';
import './password.html';
import './payment.html';
import './settings.html';

const texts = new ReactiveVar({});

Template.Settings.onCreated(function() {
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

Template.Settings.helpers({
    texts() {
        return texts.get();
    }
});

//username form

    const editMode = new ReactiveVar(false);
    const usernameSubmitting = new ReactiveVar(false);

    Template.usernameSettings.helpers({
        texts() {
            return texts.get();
        },
        schema: new SimpleSchema({ username: String }),
        editMode() {
            return editMode.get();
        },
        submitting() {
            return usernameSubmitting.get();
        }
    });

    Template.usernameSettings.events({ 
        'click .edit-mode'( e, t ) { 
            editMode.set(true);
        }
    });

    AutoForm.hooks({
        usernameForm: {
            before: { method( doc ) {
                usernameSubmitting.set(true);
                return doc;
            }},
            after: { method( err ) {
                if( err ) {
                    showAlert( err.reason, 'danger');
                } else {
                    showAlert( 'Username changed successfully!' );
                    editMode.set(false);
                    usernameSubmitting.set(false);
                }
            }}
        }
    });

//emails form

    const newEmail = new ReactiveVar(0);

    Template.emailSettings.helpers({
        texts() {
            return texts.get();
        },
        newEmail() { return newEmail.get(); }
    });

    Template.emailSettings.events({
        'click .new-email'( e, t ) {
            const user = Meteor.user();
            const index = user.emails.length + 1;
            newEmail.set( index );
        },
    });

    Template.emailRow.onCreated(function() {
        this.verifying = new ReactiveVar();
        this.removing = new ReactiveVar();
    });

    Template.emailRow.helpers({
        verifying() { return Template.instance().verifying.get(); },
        removing() { return Template.instance().removing.get(); },
        plusOne( index ) {
            return ++index;
        }
    });

    Template.emailRow.events({
        'click .verify'( e, t ) {
            t.verifying.set(true);
            const email = t.$( e.target ).data('email');
            sendVerificationEmail.call({ email }, ( err )=> {
                if( err ) {
                    console.error(err);
                    showAlert( err.reason, 'danger');
                } else {
                    showAlert('Verification email sent successfully!');
                }
                t.verifying.set();                
            });
        },
        'click .remove'( e, t ) {
            t.removing.set( true );
            const email = t.$( e.target ).data('email');
            modifyEmail.call({ email, action: 'remove' }, ( err )=> {
                if( err ) {
                    console.error(err);
                    showAlert( err.reason, 'danger');
                } else {
                    showAlert('Email removed!');
                }
                t.removing.set( false );
            });
        }
    });

    Template.newEmailForm.onCreated(function() {
        this.submitting = new ReactiveVar();
        this.validator = new SimpleSchema({
            email: SimpleSchema.RegEx.EmailWithTLD
        }).newContext();
    });

    Template.newEmailForm.helpers({
        newEmail() { return newEmail.get(); },
        submitting() { return Template.instance().submitting.get(); }
    });

    Template.newEmailForm.events({
        'click .submit, submit #newEmail'( e, t ) {

            e.preventDefault();
            e.stopPropagation();

            t.submitting.set(true);

            let email = t.$( '#new-email-input' ).val();
            t.validator.validate({ email });
            if( t.validator.isValid() ) {
                //add email here
                modifyEmail.call({ email, action: 'add' }, ( err, res )=> {
                    if( err ) {
                        console.error( err );
                        showAlert( err.reason, 'danger');
                    } else {
                        showAlert('Successfully added email!');
                        newEmail.set(0);
                    }
                    t.submitting.set();
                });
            } else {
                console.error( t.validator.validationErrors() );
                showAlert('Please enter a valid email id!', 'danger');
                t.submitting.set();
            }
        },
        'click .cancel'( e, t ) {
            newEmail.set(0);
        }
    });

//numbers form

    const newNumber = new ReactiveVar(0);

    Template.numberSettings.helpers({
        texts() {
            return texts.get();
        },
        newNumber() { return newNumber.get(); }
    });

    Template.numberSettings.events({
        'click .new-number'() {
            const user = Meteor.user();
            const index = user.numbers.length + 1;
            newNumber.set( index );
        },
    });

    Template.numberRow.onCreated(function() {
        this.removing = new ReactiveVar();
    });

    Template.numberRow.helpers({
        removing() { return Template.instance().removing.get(); },
        plusOne( index ) {
            return ++index;
        }
    });

    Template.numberRow.events({
        'click .remove'( e, t ) {
            t.removing.set(true);
            const number = t.data.number;
            
            removeMobile.call({ number }, ( err )=> {
                if( err ) showAlert( err.reason, 'danger');
                else {
                    showAlert('Mobile numer successfully removed!');
                    t.removing.set();
                }
            });
        }
    });

    Template.newNumberForm.onCreated(function() {
        this.submitting = new ReactiveVar();
        this.otpSubmit = new ReactiveVar();
        this.newMobile = new ReactiveVar();
        console.log( this );
    });

    Template.newNumberForm.helpers({
        newNumber() { return newNumber.get(); },
        submitting() { return Template.instance().submitting.get(); },
        otpSubmit() { return Template.instance().otpSubmit.get(); },
        newMobile() { return Template.instance().newMobile.get(); }
    });

    Template.newNumberForm.events({
        'click .submit, submit #newNumber'( e, t ) {

            e.preventDefault();
            e.stopPropagation();

            t.submitting.set(true);

            if( t.otpSubmit.get() ) {
                //submit otp
                const number = t.newMobile.get();
                const otp = t.$( '#new-number-otp' ).val();
                verifyMobile.call({ number, otp }, ( err )=> {
                    if( err ) {
                        showAlert( err.reason, 'danger');
                        t.submitting.set();
                    }
                    else {
                        showAlert('Mobile number successfully added!');
                        t.submitting.set();
                        t.otpSubmit.set();
                        t.newMobile.set();
                        newNumber.set(0);
                    }
                });
            } else {
                //add new number
                let number = t.$( '#new-number-input' ).val();
                
                //check if mobile is already in use
                if( number.length === 8 ) {
                    number = `852${number}`
                }

                newMobile.call({ number }, ( err )=> {
                    if( err ) {
                        showAlert( err.reason, 'danger');
                        t.submitting.set();
                    }
                    else {
                        showAlert(`
                            A one-time password has been sent to this number,
                            use it to complete registration.
                        `);
                        t.submitting.set();
                        t.otpSubmit.set( true );
                        t.newMobile.set( number );
                    }
                });
            }
        },
        'click .cancel'( e, t ) {
            newNumber.set(0);
        }
    });

//change password form
    Template.passwordSettings.helpers({
        texts() {
            return texts.get();
        },
        schema: new SimpleSchema({
            old: String,
            new: String,
            confirm: String
        })
    });

    AutoForm.hooks({
        changePassword: { onSubmit( doc, up, curr ) {
            if( doc.new !== doc.confirm ) {
                showAlert('New passwords must match!', 'danger');
                this.done(new Error('New passwords must match!'));
            } else {
                Accounts.changePassword( doc.old, doc.new, ( err )=> {
                    if( err ) {
                        showAlert( `${err.reason}!`, 'danger' );
                        this.done( new Error( err ) );
                    } else {
                        showAlert('Password Successfully Updated!');
                        this.done();
                    }
                });
            }
            return false;
        }}
    });
