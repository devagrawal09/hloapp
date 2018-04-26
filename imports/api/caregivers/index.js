import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { caregiverSchema, profileSchema, experienceSchema, servicesSchema, imagesSchema, pricingSchema } from './schema.js';

export const Caregivers = new Mongo.Collection('caregivers');

export const updateCaregiverProfile = new ValidatedMethod({ //update caregiver profile
    name: 'caregiver.update',
    validate: caregiverSchema.validator(),
    run( doc ) {
        
        if ( !this.userId || doc.user !== this.userId ) {
            //if current user doesn't match received profile user
            throw new Meteor.Error('caregiver.update.profile.unauthorized',
            'Invalid input, please try again');
        }

        doc.isProfileComplete = true;

        let result = Caregivers.update({
            _id: doc._id,
            user: doc.user
        }, {
            $set: doc
        });

        if ( !result ) {
            //input ids don't match
           throw new Meteor.Error('caregiver.update.unauthorized',
           'Invalid input, please try again');
        }

        Meteor.users.update( this.userId, { $set: {
            firstName: doc.firstName,
            lastName: doc.lastName,
            fullName: doc.fullName
        }});
    }
});
/*
    export const updateProfilePic = new ValidatedMethod({   //update profile image
    });

    export const updateCoverPic = new ValidatedMethod({     //update cover image
    });
*/