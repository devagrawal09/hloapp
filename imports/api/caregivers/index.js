import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { profileSchema, experienceSchema, servicesSchema, imagesSchema, pricingSchema } from './schema.js';

export const Caregivers = new Mongo.Collection('caregivers');

export const updateProfile = new ValidatedMethod({      //update profile
    name: 'caregiver.update.profile',
    validate: profileSchema.validator(),
    run( profile ) {

        if ( profile.user !== this.userId ) {
           //if current user doesn't match received profile user
           throw new Meteor.Error('caregiver.update.profile.unauthorized',
            'Invalid input, please try again');            
        }

        let result = Caregivers.update({
            _id: profile._id,
            user: profile.user
        }, {
            $set: profile
        });

        if ( !result ) {
            //input ids don't match
           throw new Meteor.Error('caregiver.update.profile.unauthorized',
           'Invalid input, please try again');
        }

    }
});

export const updateExperiences = new ValidatedMethod({  //update experiences
    name: 'caregiver.update.experiences',
    validate: experienceSchema.validator(),
    run( experiences ) {

        if ( experiences.user !== this.userId ) {
           //if current user doesn't match received document
           throw new Meteor.Error('caregiver.update.experiences.unauthorized',
            'Invalid input, please try again');            
        }

        let result = Caregivers.update({
            _id: experiences._id,
            user: experiences.user
        }, {
            $set: experiences
        });

        if ( !result ) {
            //input ids don't match
           throw new Meteor.Error('caregiver.update.experiences.unauthorized',
           'Invalid input, please try again');
        }

    }
});

export const updateServices = new ValidatedMethod({     //update services
    name: 'caregiver.update.services',
    validate: servicesSchema.validator(),
    run( services ) {

        console.log( 'am i visible' );

        if ( services.user !== this.userId ) {
           //if current user doesn't match received document
           throw new Meteor.Error('caregiver.update.services.unauthorized',
            'Invalid input, please try again');            
        }

        let result = Caregivers.update({
            _id: services._id,
            user: services.user
        }, {
            $set: services
        });

        if ( !result ) {
            //input ids don't match
           throw new Meteor.Error('caregiver.update.services.unauthorized',
           'Invalid input, please try again');
        }

    }
});

export const updatePlan = new ValidatedMethod({
    name: 'caregiver.update.plan',
    validate: pricingSchema.validator(),
    run( plan ) {
        if ( plan.user !== this.userId ) {
            //if current user doesn't match received document
            throw new Meteor.Error('caregiver.update.plan.unauthorized',
             'Invalid input, please try again');            
        };
        
        let result = Caregivers.update({
            _id: plan._id,
            user: plan.user
        }, {
            $set: plan
        });

        if ( !result ) {
            //input ids don't match
           throw new Meteor.Error('caregiver.update.plan.unauthorized',
           'Invalid input, please try again');
        }
    }
});
/*
    export const updateProfilePic = new ValidatedMethod({   //update profile image
    });

    export const updateCoverPic = new ValidatedMethod({     //update cover image
    });
*/