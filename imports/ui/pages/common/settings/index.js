import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { ReactiveVar } from 'meteor/reactive-var';
import { AutoForm } from 'meteor/aldeed:autoform';

import { sendVerificationEmail, modifyEmail } from '../../../../api/users';

import SimpleSchema from 'simpl-schema';
import showAlert from '../../../shared-components/alert';

import './username.html';
import './emails.html';
import './password.html';
import './payment.html';
import './settings.html';

//username form

    const editMode = new ReactiveVar(false);

    Template.usernameSettings.helpers({
        schema: new SimpleSchema({ username: String }),
        editMode() {
            return editMode.get();
        }
    });

    Template.usernameSettings.events({ 
        'click .edit-mode'( e, t ) { 
            editMode.set(true);
        } 
    });

    AutoForm.hooks({
        usernameForm: {
            after: { method( err, res ) {
                if( err ) {
                    showAlert( err.reason, 'danger');
                } else {
                    showAlert( 'Username changed successfully!' );
                    editMode.set(false);
                }
            }}
        }
    });

//emails form
    Template.emailSettings.onCreated(function() {
        this.newEmail = new ReactiveVar(0);
        this.validator = new SimpleSchema({
            email: SimpleSchema.RegEx.EmailWithTLD
        }).newContext();
    });

    Template.emailSettings.helpers({
        plusOne( index ) {
            return ++index;
        },
        newEmail() {
            return Template.instance().newEmail.get();
        }
    });

    Template.emailSettings.events({ 
        'click .verify'( e, t ) {
            const email = t.$( e.target ).data('email');
            sendVerificationEmail.call({ email }, ( err, res )=> {
                if( err ) {
                    console.error(err);
                    showAlert( err.reason, 'danger');
                } else {
                    showAlert('Verification email sent successfully!');
                }
            });
        },
        'click .remove'( e, t ) {
            const email = t.$( e.target ).data('email');
            modifyEmail.call({ email, action: 'remove' }, ( err, res )=> {
                if( err ) {
                    console.error(err);
                    showAlert( err.reason, 'danger');
                } else {
                    showAlert('Email removed!');
                }
            });
        },
        'click .new-email'( e, t ) {
            const user = Meteor.user();
            const index = user.emails.length + 1;
            t.newEmail.set( index );
        },
        'click .submit, submit #newEmail'( e, t ) {

            e.preventDefault();
            e.stopPropagation();

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
                        t.newEmail.set(0);
                    }
                });
            } else {
                console.error( t.validator.validationErrors() );
                showAlert('Please enter a valid email id!', 'danger');
            }
        },
        'click .cancel'( e, t ) {
            t.newEmail.set(0);
        }
    });

//change password form
    Template.passwordSettings.helpers({
        schema: new SimpleSchema({
            old: { type: String, label: 'Old Password' },
            new: { type: String, label: 'New Password' },
            confirm: { type: String, label: 'New Password (again)' }
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
