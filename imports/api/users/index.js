import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

import { Caregivers } from '../caregivers';

export const userProfileSchema = new SimpleSchema({
    firstName: String,
    lastName: String,
    fullName: {
        type: String,
        optional: true,
        autoValue() {
            let firstName = this.field( 'firstName' ).value;
            let lastName = this.field( 'lastName' ).value;
            return `${firstName} ${lastName}`;
        }
    },
    gender: Datatypes.Gender,
    phone: String,
    address: String,
    district: Datatypes.Location,
    otherDistrict: {
        type: String,
        optional: true,
        label: 'Please specify district'
    },
    country: Datatypes.Country,
    bookmarks: {
        type: Array,
        optional: true,
        defaultValue: []
    },
    'bookmarks.$': Datatypes.Id
});

export const updateUserProfile = new ValidatedMethod({
    name: 'user.updateProfile',
    validate: userProfileSchema.validator(),
    run( profile ) {
        
        let cleanProfile = userProfileSchema.clean( profile );

        let result = Meteor.users.update( this.userId, {
            $set: cleanProfile
        });

        if( !result ) {
            throw new Meteor.Error('user.updateProfile',
            'You are not registered with us!');
        }
    }
});

export const bookmarkCaregiver = new ValidatedMethod({          //toggle caregiver bookmark
    name: 'user.bookmark',
    validate: new SimpleSchema({
        id: Datatypes.Id
    }).validator(),
    run({ id }) {

        //must be logged in
        if( !this.userId ) {
            throw new Meteor.Error('user.bookmark.unauthorized',
            'You are not logged in!');
        }

        //check that the input caregiver exists
        let caregiver = Caregivers.findOne( id );

        //caregiver doesn't exist
        if( !caregiver ) {
            throw new Meteor.Error('user.bookmark.invalid', 
            'Invalid input! Please try again');
        }

        //can't bookmark self
        if( caregiver.user === this.userId ) {
            throw new Meteor.Error('user.bookmark.invalid', 
            'You cannot bookmark yourself!');
        }

        let currentUser = Meteor.users.findOne( this.userId );

        //check if current user has already bookmarked this caregiver
        if( _.indexOf( currentUser.bookmarks, id ) === -1 ) {

            //add bookmark
            Meteor.users.update({
                _id: this.userId
            }, {
                $push: { bookmarks: id }
            });
            return true;
            
        }

        //remove existing bookmark
        Meteor.users.update({
            _id: this.userId
        }, {
            $pull: { bookmarks: id }
        });

        return true;
    }
});

export const modifyEmail = new ValidatedMethod({                //add or remove email
    name: 'user.email',
    validate: new SimpleSchema({
        email: SimpleSchema.RegEx.EmailWithTLD,
        action: {
            type: String,
            allowedValues: ['add', 'remove']
        }
    }).validator(),
    run({ email, action }) {

        //must be logged in
        if( !this.userId ) {
            throw new Meteor.Error('user.email.unauthorized',
            'You are not logged in!');
        }

        if( !this.isSimulation ) {          //only continue if method is running on server

            if( action === 'add' ) {        //add email
                Accounts.addEmail( this.userId, email );
                Accounts.sendVerificationEmail( this.userId, email );
            } else
            if( action === 'remove' ) {     //remove email

                let user = Meteor.users.findOne( this.userId );
                let verifiedEmails = user.emails.filter( obj => obj.verified );

                //if email is the only verified email
                if( (verifiedEmails.length === 1) && (verifiedEmails[0].address === email) ) {
                    throw new Meteor.Error('user.email.error', 
                    'You must have at least one verified email!');
                }

                Accounts.removeEmail( this.userId, email );
            }
        }

        return true;
    }
});

export const sendVerificationEmail = new ValidatedMethod({      //send verification mail
    name: 'user.email.sendVerification',
    validate: new SimpleSchema({
        email: SimpleSchema.RegEx.EmailWithTLD
    }).validator(),
    run({ email }) {
        
        //must be logged in
        if( !this.userId ) {
            throw new Meteor.Error('user.email.unauthorized',
            'You are not logged in!');
        }

        if( !this.isSimulation ) {  //run on server
            Accounts.sendVerificationEmail( this.userId, email );
        }

        return true;
    }
});

Meteor.methods({
    'user.getType'() {
        if( !this.isSimulation ) return Meteor.users.findOne( this.userId ).profile.type;
    }
});

Meteor.users.helpers({
    getCaregiver() {
        return Caregivers.findOne({
            user: this._id
        });
    }
});
