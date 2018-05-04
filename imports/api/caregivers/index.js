import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { FilesCollection } from 'meteor/ostrio:files';

import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

import { caregiverSchema, photoSchema } from './schema.js';

export const Caregivers = new Mongo.Collection('caregivers');

export const CaregiverImages = new FilesCollection({
    collectionName: 'caregiver-images',
    allowClientCode: false,
    onBeforeUpload(file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
          return true;
        }
        return 'Please upload image, with size equal or less than 10MB';
      }
});

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

export const updateProfilePhoto = new ValidatedMethod({     //update profile image
    name: 'caregiver.images.set.profile',
    validate: photoSchema.validator(),
    run({ _id }) {

        if( !this.userId ) {
            throw new Meteor.Error('caregiver.images.set.profile.unauthorized', 
            'You are not logged in!');
        }

        let photo = CaregiverImages.findOne({ _id });

        if( !photo || photo.meta.user !== this.userId ) {
            throw new Meteor.Error('caregiver.images.set.profile.invalid', 
            'Invalid input! Please try again');
        }

        Caregivers.update({ user: this.userId }, { $set: {
            profilePhoto: _id
        }});

        return true;
    }
});

export const deletePhoto = new ValidatedMethod({            //remove photo from array
    name: 'caregiver.images.remove',
    validate: photoSchema.validator(),
    run( q ) {

        if( !this.userId ) {
            throw new Meteor.Error('caregiver.images.remove.unauthorized', 
            'You are not logged in!');
        }

        let photo = CaregiverImages.findOne( q );

        if( !photo || photo.meta.user !== this.userId ) {
            throw new Meteor.Error('caregiver.images.remove.invalid', 
            'Invalid input! Please try again');
        }

        photo.remove(( err )=> {
            console.error( err );
        });
    }
});

/*
    export const updateCoverPic = new ValidatedMethod({     //update cover image
    });
*/