import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Jobs, Reviews } from '../jobs';
import { detailsSchema, experienceSchema, servicesSchema, pricingSchema, photoSchema } from './schema.js';
import { CaregiverImages } from './images';

export const Caregivers = new Mongo.Collection('caregivers');
export { CaregiverImages };

//methods

    export const updateCaregiverDetails = new ValidatedMethod({
        name: 'caregiver.update.details',
        validate: detailsSchema.validator(),
        run( doc ) {
            
            if ( !this.userId || doc.user !== this.userId ) {
                //if current user doesn't match received profile user
                throw new Meteor.Error('caregiver.update.unauthorized',
                'Invalid input, please try again');
            }

            doc.name =`${doc.firstName} ${doc.lastName}`;
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
                fullName: doc.name
            }});

            return 'Details';
        }
    });

    export const updateCaregiverExp = new ValidatedMethod({
        name: 'caregiver.update.experiences',
        validate: experienceSchema.validator(),
        run( doc ) {
            
            if ( !this.userId || doc.user !== this.userId ) {
                //if current user doesn't match received profile user
                throw new Meteor.Error('caregiver.update.unauthorized',
                'Invalid input, please try again');
            }

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

            return 'Experiences';
        }
    });

    export const updateCaregiverServices = new ValidatedMethod({
        name: 'caregiver.update.services',
        validate: servicesSchema.validator(),
        run( doc ) {
            
            if ( !this.userId || doc.user !== this.userId ) {
                //if current user doesn't match received profile user
                throw new Meteor.Error('caregiver.update.unauthorized',
                'Invalid input, please try again');
            }

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

            return 'Services';
        }
    });

    export const updateCaregiverPlan = new ValidatedMethod({
        name: 'caregiver.update.pricing',
        validate: pricingSchema.validator(),
        run( doc ) {
            
            if ( !this.userId || doc.user !== this.userId ) {
                //if current user doesn't match received profile user
                throw new Meteor.Error('caregiver.update.unauthorized',
                'Invalid input, please try again');
            }

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

            return 'Plan';
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

    Meteor.methods({
        'caregiver.complete'() {

            if ( !this.userId ) {
                //not logged in
                throw new Meteor.Error('caregiver.complete.unauthorized',
                'You need to be logged in!');
            }

            const result = Caregivers.update({
                user: this.userId,
                isProfileComplete: false
            }, {
                $set: { isProfileComplete: true }
            });

            if( !result ) {
                throw new Meteor.Error('caregiver.complete.error', 
                'Your caregiver profile is either already complete or does not exist!');
            }

            if( !this.isSimulation ) Caregivers.notifications.finalise({ userId: this.userId });

            return true;
        }
    });

//job methods

    export const applyForJob = new ValidatedMethod({    //apply for job
        name: 'jobs.apply',
        validate: detailsSchema.pick( '_id' ).validator(),
        run({ _id }) {

            if( !this.userId || Meteor.users.findOne( this.userId ).profile.type !== 'caregiver' ) {
                //current user is not a caregiver
                throw new Meteor.Error('jobs.apply.unauthorized',
                'You are not a registered caregiver!');
            }

            //get current user's caregiver profile
            let caregiver = Caregivers.findOne({
                user: this.userId
            });

            if( caregiver.currentJob ) {
                //current user already employed
                throw new Meteor.Error('jobs.apply.unauthorized',
                'You are already employed on a job!');
            }

            //update the job document with the new applicant
            let result = Jobs.update({
                _id,
                status: 'open'
            }, {
                $push: { applicants: caregiver._id } 
            });

            if( !result ) {
                //invalid input
                throw new Meteor.Error('jobs.apply.error',
                'The job you are trying to apply to is closed or does not exist!');
            }

            //update caregiver profile with applied job
            Caregivers.update({
                user: this.userId
            }, { $push: {
                appliedJobs: _id
            }});

            if( !this.isSimulation ) Jobs.notifications.newApplication({ caregiverId: caregiver._id, jobId: _id });

            return true;
        }
    });

    export const acceptOffer = new ValidatedMethod({    //accept offered job
        name: 'jobs.accept',
        validate: detailsSchema.pick( '_id' ).validator(),
        run({ _id }) {

            let job = _id;

            if( !this.userId || Meteor.users.findOne( this.userId ).profile.type !== 'caregiver' ) {
                //current user is not a caregiver
                throw new Meteor.Error('jobs.accept.unauthorized',
                'You are not a registered caregiver!');
            }

            //get current user's caregiver profile
            let caregiver = Caregivers.findOne({
                user: this.userId,
                offers: job
            });

            if( !caregiver ) {
                //caregiver hasn't been offered job
                throw new Meteor.Error('jobs.accept.unauthorized',
                'You have not been offered this job!');
            }

            if( caregiver.currentJob ) {
                //current user already employed
                throw new Meteor.Error('jobs.accept.unauthorized',
                'You are already employed on a job!');
            }

            //update the job document with the new applicant
            let result = Jobs.update({
                _id,
                status: 'open',
                offers: caregiver._id
            }, { $set: {
                status: 'hired',
                hired: caregiver._id,
                applicants: [],
                offers: []
            }});

            if( !result ) {
                //invalid input
                throw new Meteor.Error('jobs.accept.error',
                'This job is either no longer open or does not exist!');
            }

            //update caregiver profile with applied job
            Caregivers.update( caregiver._id, { 
                $set: { currentJob: job },
                $pull: { offers: job }
            });

            if( this.isSimulation ) Jobs.notifications.offerAccepted({ caregiverId: caregiver._id, jobId: _id });

            return true;
        }
    });

Caregivers.helpers({
    username() {
        return Meteor.users.findOne( this.user ).username;
    },
    dp() {
        return this.profilePhoto ? CaregiverImages.findOne( this.profilePhoto ) : {
            link: `/img/avatar-${this.gender}.png`
        };
    },
    photos() {
        return CaregiverImages.find({ meta: { user: this.user }});
    },
    reviews() {
        return Reviews.find({
            job: { $in: this.jobHistory }
        });
    },
    rating() {
        const reviews = this.reviews().fetch();
        const count = reviews.length;
        return reviews.reduce(( rating, review )=> rating + review.rating, 0)/count;
    }
});
