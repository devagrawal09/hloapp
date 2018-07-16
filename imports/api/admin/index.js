import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { Caregivers } from '../caregivers';

import userChecks from '../users/checks.js';
import { check } from 'meteor/check';

if( Meteor.isServer ) {
    if( !Meteor.users.findOne({ username: 'admin' }) ) {
        Accounts.createUser({
            username: 'admin',
            password: 'hloadmin2373',
            profile: {
                firstName: 'HLO',
                lastName: 'Admin',
                type: 'admin'
            }
        });
    }
}

Meteor.methods({
    setCaregiverStatus({ caregiverId, status = false }) {

        userChecks.loggedIn( this.userId );
        userChecks.isAdmin( this.userId );

        check( caregiverId, String );
        check( status, Boolean );

        const res = Caregivers.update( caregiverId, {
            $set: { isProfileComplete: status }
        });

        if( !res ) 
            throw new Meteor.Error('admin.invalid', 
            'Invalid Input! Please try again!');

        return true;
    },
    deleteCaregiver({ caregiverId }) {

        userChecks.loggedIn( this.userId );
        userChecks.isAdmin( this.userId );

        check( caregiverId, String );

        const caregiver = Caregivers.findOne( caregiverId );

        if( !caregiver ) 
            throw new Meteor.Error('admin.invalid', 
            'Invalid Input! Please try again!');

        Caregivers.remove( caregiver._id );
        Meteor.users.remove( caregiver.user );

        return true;
    },
    setProfessional({ caregiverId, professional = false }) {

        userChecks.loggedIn( this.userId );
        userChecks.isAdmin( this.userId );

        check( caregiverId, String );
        check( professional, Boolean );

        const res = Caregivers.update( caregiverId, {
            $set: { professional }
        });

        if( !res )
            throw new Meteor.Error('admin.invalid', 
            'Invalid Input! Please try again!');

        return true;
    }
});