import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import Datatypes from '../data-types';

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
    country: Datatypes.Country
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

Meteor.methods({
    'user.getType'() {
        if( !this.isSimulation ) return Meteor.users.findOne( this.userId ).profile.type;
    }
});
