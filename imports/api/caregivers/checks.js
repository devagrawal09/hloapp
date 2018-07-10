import { Meteor } from 'meteor/meteor';

import SimpleSchema from 'simpl-schema';

import { detailsSchema, experienceSchema, servicesSchema, pricingSchema } from './schema.js';

const caregiverSchema = new SimpleSchema();
caregiverSchema.extend( detailsSchema );
caregiverSchema.extend( experienceSchema );
caregiverSchema.extend( servicesSchema );
caregiverSchema.extend( pricingSchema );

export default {
    isCaregiver( userId ) {
        if( Meteor.users.findOne( userId ).profile.type !== 'caregiver' ) {
            //current user is not a caregiver
            throw new Meteor.Error('caregivers.unauthorized',
            'You are not a registered caregiver!');
        }
    },
    isComplete( caregiver ) {
        if( !caregiver.isProfileComplete )
            caregiverSchema.validate( caregiver );  
    }
}
