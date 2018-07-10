import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { analytics } from 'meteor/okgrow:analytics';

import { Jobs, Reviews } from '../jobs';
import { 
    detailsSchema, 
    experienceSchema, 
    servicesSchema, 
    pricingSchema, 
    photoSchema 
} from './schema.js';
import { CaregiverImages } from './images';
import userChecks from '../users/checks';
import caregiverChecks from './checks.js';

export const Caregivers = new Mongo.Collection('caregivers');
export { CaregiverImages };

//methods

    export const updateCaregiverDetails = new ValidatedMethod({
        name: 'caregiver.update.details',
        validate: detailsSchema.validator(),
        run( doc ) {

            userChecks.loggedIn( this.userId );
            userChecks.isCurrent( this.userId, doc.user );

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

            userChecks.loggedIn( this.userId );
            userChecks.isCurrent( this.userId, doc.user );

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

            userChecks.loggedIn( this.userId );
            userChecks.isCurrent( this.userId, doc.user );

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

            userChecks.loggedIn( this.userId );
            userChecks.isCurrent( this.userId, doc.user );

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

    export const updateProfilePhoto = new ValidatedMethod({ //update profile image
        name: 'caregiver.images.set.profile',
        validate: photoSchema.validator(),
        run({ _id }) {

            userChecks.loggedIn( this.userId );

            let photo = CaregiverImages.findOne({ _id });

            if( !photo ) {
                throw new Meteor.Error('caregiver.images.invalid', 
                'Invalid input! Please try again');
            }

            userChecks.isCurrent( this.userId, photo.meta.user );

            Caregivers.update({ user: this.userId }, { $set: {
                profilePhoto: _id
            }});

            return true;
        }
    });

    export const deletePhoto = new ValidatedMethod({    //remove photo from array
        name: 'caregiver.images.remove',
        validate: photoSchema.validator(),
        run( q ) {

            userChecks.loggedIn( this.userId );

            let photo = CaregiverImages.findOne( q );

            if( !photo ) {
                throw new Meteor.Error('caregiver.images.invalid', 
                'Invalid input! Please try again');
            }

            userChecks.isCurrent( this.userId, photo.meta.user );

            photo.remove();
        }
    });

    Meteor.methods({
        'caregiver.complete'() {

            userChecks.loggedIn( this.userId );
            userChecks.isVerified( this.userId );

            const caregiver = Caregivers.findOne({
                user: this.userId,
                isProfileComplete: false
            });

            caregiverChecks.isComplete( caregiver );

            const result = Caregivers.update( caregiver._id, {
                $set: { isProfileComplete: true }
            });

            if( !result )
                throw new Meteor.Error('caregiver.complete.error', 
                'Your caregiver profile is either already complete or does not exist!');
                
            if( this.isSimulation ) analytics.track('New Caregiver', {
                name: caregiver.name,
                plan: caregiver.plan,
                gender: caregiver.gender,
                experience: caregiver.years,
                location: caregiver.location,
                hourlyRate: caregiver.hourlyRate,
                extraCharges: caregiver.extraCharges,
            });
            else Caregivers.notifications.finalise({ userId: this.userId });            

            return true;
        }
    });

//job methods

    export const applyForJob = new ValidatedMethod({    //apply for job
        name: 'jobs.apply',
        validate: detailsSchema.pick( '_id' ).validator(),
        run({ _id }) {

            userChecks.loggedIn( this.userId );
            caregiverChecks.isCaregiver( this.userId );

            //get current user's caregiver profile
            let caregiver = Caregivers.findOne({ user: this.userId });

            caregiverChecks.isComplete( caregiver );

            if( caregiver.currentJob )
                //current user already employed
                throw new Meteor.Error('jobs.apply.unauthorized',
                'You are already employed on a job!');

            //update the job document with the new applicant
            let result = Jobs.update({
                _id,
                status: 'open'
            }, {
                $push: { applicants: caregiver._id } 
            });

            if( !result )
                //invalid input
                throw new Meteor.Error('jobs.apply.error',
                'The job you are trying to apply to is closed or does not exist!');

            //update caregiver profile with applied job
            Caregivers.update({
                user: this.userId
            }, { $push: {
                appliedJobs: _id
            }});

            if( !this.isSimulation )
                Jobs.notifications.newApplication(
                    { caregiverId: caregiver._id, jobId: _id }
                );

            return true;
        }
    });

    export const acceptOffer = new ValidatedMethod({    //accept offered job
        name: 'jobs.accept',
        validate: detailsSchema.pick( '_id' ).validator(),
        run({ _id }) {

            let job = _id;

            userChecks.loggedIn( this.userId );
            caregiverChecks.isCaregiver( this.userId );

            //get current user's caregiver profile
            let caregiver = Caregivers.findOne({
                user: this.userId,
                offers: job
            });

            if( !caregiver )
                //caregiver hasn't been offered job
                throw new Meteor.Error('jobs.accept.unauthorized',
                'You have not been offered this job!');

            if( caregiver.currentJob )
                //current user already employed
                throw new Meteor.Error('jobs.accept.unauthorized',
                'You are already employed on a job!');

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

            if( !result )
                //invalid input
                throw new Meteor.Error('jobs.accept.error',
                'This job is either no longer open or does not exist!');

            //update caregiver profile with applied job
            Caregivers.update( caregiver._id, { 
                $set: { currentJob: job },
                $pull: { offers: job }
            });

            if( this.isSimulation )
                Jobs.notifications.offerAccepted(
                    { caregiverId: caregiver._id, jobId: _id }
                );

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
