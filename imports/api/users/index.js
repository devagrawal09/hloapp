import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

import { Caregivers } from '../caregivers';
import { sendSMS } from '../sms';

const TimerHandlers = {};

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

export const changeUsername = new ValidatedMethod({             //change username
    name: 'user.username',
    validate: new SimpleSchema({ username: String }).validator(),
    run({ username }) {

        //must be logged in
        if( !this.userId ) {
            throw new Meteor.Error('user.email.unauthorized',
            'You are not logged in!');
        }

        if( !this.isSimulation ) Accounts.setUsername( this.userId, username );

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

        if( !this.isSimulation ) {  //only continue if method is running on server

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

export const newMobile = new ValidatedMethod({                  //initiate adding a mobile
    name: 'user.number.new',
    validate: new SimpleSchema({
        number: String
    }).validator(),
    run({ number }) {

        //must be logged in
        if( !this.userId ) {
            throw new Meteor.Error('user.mobile.unauthorized',
            'You are not logged in!');
        }

        if( !this.isSimulation ) {  //only continue if method is running on server

            //check if mobile is already in use
            const existing = Meteor.users.findOne({ numbers: number });

            if( existing ) {
                throw new Meteor.Error('user.mobile.exists', 
                'This mobile number is already registered with HLO!');
            }

            //clear any existing newMobile timer
            const oldHandle = TimerHandlers[this.userId];
            if( oldHandle ) Meteor.clearTimeout( oldHandle );

            //Generate an OTP
            const otp = `${ Math.floor( Random.fraction() * 1000000 ) }`;

            //Start timer
            const newHandle = Meteor.setTimeout( ()=> {
                Meteor.users.update( this.userId, {
                    $unset: { newMobile: '' }
                });
                TimerHandlers[this.userId] = undefined;
            }, 600000);

            //save otp and number to database
            Meteor.users.update( this.userId, {
                $set: { newMobile: { number, otp } }
            });

            //save timer handler
            TimerHandlers[ this.userId ] = newHandle;

            sendSMS({
                to: number,
                msg: `
                    Thank you for registering with HealthyLovedOnes! To complete
                    registration, enter ${otp} as you one-time password.
                    This OTP will expire in 10 minutes.
                `
            });
        }

        return true;
    }
});

export const verifyMobile = new ValidatedMethod({               //verify mobile otp
    name: 'user.mobile.verify',
    validate: new SimpleSchema({
        number: String,
        otp: String
    }).validator(),
    run({ number, otp }) {

        //must be logged in
        if( !this.userId ) {
            throw new Meteor.Error('user.mobile.unauthorized',
            'You are not logged in!');
        }

        if( !this.isSimulation ) {  //only continue if method is running on server
            
            const newMobile = Meteor.users.findOne( this.userId ).newMobile;

            //check if newMobile exists
            if( !newMobile ) {
                throw new Meteor.Error('user.mobile.error', 
                'No mobile number to verify!');
            }

            //check if number is correct
            if( newMobile.number !== number ) {
                throw new Meteor.Error('user.mobile.error', 
                'Invalid Input! Please try again!');
            }

            const handle = TimerHandlers[ this.userId ];

            //check if otp is correct
            if( newMobile.otp !== otp ) {

                //remove timer and data
                Meteor.clearTimeout( handle );
                Meteor.users.update( this.userId, {
                    $unset: { newMobile: '' }
                });

                throw new Meteor.Error('user.mobile.invalid', 
                'The OTP you entered was incorrect!');
            }

            //otp is correct, remove timer and update data
            Meteor.clearTimeout( handle );

            Meteor.users.update( this.userId, {
                $push: { numbers: number },
                $unset: { newMobile: '' }
            });

            if( !this.isSimulation ) Meteor.users.notifications.newMobile( number );

            return true;
        }
    }
});

export const removeMobile = new ValidatedMethod({
    name: 'user.number.remove',
    validate: new SimpleSchema({
        number: String
    }).validator(),
    run({ number }) {

        //must be logged in
        if( !this.userId ) {
            throw new Meteor.Error('user.mobile.unauthorized',
            'You are not logged in!');
        }

        if( !this.isSimulation ) {  //only continue if method is running on server
            Meteor.users.update({
                _id: this.userId,
                numbers: number
            }, {
                $pull: { numbers: number }
            });
        }

        return true;
    }
});

export const pickType = new ValidatedMethod({           //let undecided user pick type
    name: 'user.type',
    validate: new SimpleSchema({
        type: {
            type: String,
            allowedValues: ['customer', 'caregiver']
        }
    }).validator(),
    run({ type }) {

        const user = Meteor.users.findOne( this.userId );
        
        if( (!user.services.facebook && !user.services.linkedin) || user.profile.type ) {    //only for users logged in through fb
            throw new Meteor.Error('user.type.unauthorized', 
            'You are not authorized for this function');
        }

        let profile = user.profile;
        profile.type = type;

        Meteor.users.update( this.userId, {
            $set: { profile }
        });

        if( type === 'caregiver') {

            let first = user.firstName, last = user.lastName;
            Caregivers.insert({
                user: this.userId,
                firstName: first,
                lastName: last,
                name: `${first} ${last}`,
                isProfileComplete: false,
                jobHistory: []
            });
        };

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
    },
    dp() {
        if( this.profile.type === 'caregiver' ) {
            return Caregivers.findOne({ user: this._id }).dp();
        }
        let gender = this.gender;
        return {
            link: `/img/avatar-${gender}.png`,
            name: `Customer profile photo`
        }
    },
    getEmails() {
        return this.emails.map( email=> email.address );
    },
    isVerified() {
        return !!this.emails.filter( email=> email.verified ).length;
    }
});
