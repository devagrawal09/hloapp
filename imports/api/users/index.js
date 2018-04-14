import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import Datatypes from '../data-types';

export const userProfileSchema = new SimpleSchema({
    firstName: String,
    lastName: String,
    gender: Datatypes.Gender
});

export const updateUserProfile = new ValidatedMethod({
    name: 'user.updateProfile',
    validate: userProfileSchema.validator(),
    run( profile ) {
        
        let result = Meteor.users.update( this.userId, {
            $set: profile
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
