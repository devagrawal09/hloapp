import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { FilesCollection } from 'meteor/ostrio:files';

import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

import { Caregivers } from '../caregivers';
import { detailsSchema, photoSchema, reviewSchema } from './schema.js';

export const Jobs = new Mongo.Collection('jobs');
export const Reviews = new Mongo.Collection('reviews');
export const JobImages = new FilesCollection({
    collectionName: 'job-images',
    allowClientCode: false,
    onBeforeUpload(file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
            return true;
        }
        return 'Please upload image, with size equal or less than 10MB';
    }
});

//methods

    export const newJob = new ValidatedMethod({         //post a new job 
        name: 'jobs.new',
        validate: detailsSchema.omit('_id', 'postedBy').validator(),
        run( job ) {
            
            if( !this.userId || Meteor.users.findOne( this.userId ).profile.type === 'caregiver' ) {
                //current user is not a customer
                throw new Meteor.Error('jobs.new.unauthorized',
                'You are not registered customer');
            }

            job.postedBy = this.userId;     //posted by the current user
            job.postedOn = new Date();      //posted right now
            job.status = 'open';            //jobs open by default
            job.offers = [];                //initialize offers array
            job.applicants = [];            //and applicants array

            const id = Jobs.insert( job );  //post the job

            JobImages.update({              //set uploaded photos to new job
                meta: {
                    user: this.userId,
                    job: 'new'
                }
            }, { $set: { meta: { job: id } } }, { multi: true });

            return true;
        }
    });

    export const setDp = new ValidatedMethod({          //update profile image 
        name: 'jobs.images.set.profile',
        validate: photoSchema.validator(),
        run({ _id, job }) {

            if( !this.userId ) {
                throw new Meteor.Error('jobs.images.set.profile.unauthorized', 
                'You are not logged in!');
            }

            const photo = JobImages.update({ 
                _id,
                $or: [{
                    meta: { job }
                }, {
                    meta: { user: this.userId, job }
                }]
            }, {
                $set: { profile: true }
            });

            if( !photo ) {
                throw new Meteor.Error('jobs.images.set.profile.invalid', 
                'Invalid input! Please try again');
            }

            return true;
        }
    });

    export const deletePhoto = new ValidatedMethod({    //delete photo 
        name: 'jobs.images.remove',
        validate: photoSchema.validator(),
        run({ _id, job }) {

            if( !this.userId ) {
                throw new Meteor.Error('jobs.images.remove.unauthorized', 
                'You are not logged in!');
            }

            let photo = JobImages.findOne({
                _id,
                meta: { job }
            });

            if( !photo ) {
                throw new Meteor.Error('jobs.images.remove.invalid', 
                'Invalid input! Please try again');
            }

            photo.remove(( err )=> {
                console.error( err );
            });
        }
    });

    export const updateJob = new ValidatedMethod({      //update job details 
        name: 'jobs.update',
        validate: detailsSchema.validator(),
        run( job ) {

            if( !this.userId || Meteor.users.findOne( this.userId ).profile.type === 'caregiver' ) {
                //current user is not a customer
                throw new Meteor.Error('jobs.update.unauthorized',
                'You are not registered customer');
            }

            if( job.postedBy !== this.userId ) {
                //recieved document doesn't belong to current user
                throw new Meteor.Error('jobs.update.unauthorized',
                'Invalid Input or this job was not poste by you. Please try again');
            }

            let result = Jobs.update({
                _id: job._id,
                postedBy: job.postedBy
            }, { $set: job });

            if( !result ) {
                throw new Meteor.Error('jobs.update.unauthorized',
                'Invalid Input. Please try again');
            }
        }
    });

    export const offerJob = new ValidatedMethod({       //offer job to caregiver 
        name: 'jobs.offer',
        validate: new SimpleSchema({
            job: Datatypes.Id,
            caregiverId: Datatypes.Id
        }).validator(),
        run({ job, caregiverId }) {

            console.log( job, caregiverId );

            if( !this.userId || Meteor.users.findOne( this.userId ).profile.type === 'caregiver' ) {
                //current user is not a customer
                throw new Meteor.Error('jobs.offer.unauthorized',
                'You are not registered customer!');
            }

            let caregiver = Caregivers.findOne( caregiverId );

            if( !caregiver ) {
                //input id recieved is not a caregiver
                throw new Meteor.Error('jobs.offer.error',
                'Invalid Input, please try again!');
            }

            if( caregiver.currentJob ) {
                //caregiver is already employed
                throw new Meteor.Error('jobs.offer.error',
                'Caregiver is already employed!');
            }

            if( _.indexOf( caregiver.offers, job ) !== -1 ) {
                //job has already been offered to the caregiver
                throw new Meteor.Error('jobs.offer.error',
                'You have already offered this job to the caregiver!');
            }

            if( _.indexOf( caregiver.appliedJobs, job ) !== -1 ) {
                //caregiver has applied for this job
                throw new Meteor.Error('jobs.offer.error',
                'This caregiver has applied for this job!');
            }

            //update job with offer 
            let result = Jobs.update({
                _id: job,
                postedBy: this.userId,
                status: 'open'
            }, { $push: {
                offers: caregiverId
            }});

            if( !result ) {
                //invalid input
                throw new Meteor.Error('jobs.offer.error',
                'This Job is not open, is not posted by you, or does not exist!');
            }

            //update caregiver's profile with job id
            Caregivers.update( caregiverId, { $push: {
                offers: job
            }});
        }
    });

    export const hireApplicant = new ValidatedMethod({  //hire an applicant 
        name: 'jobs.hire',
        validate: new SimpleSchema({
            job: Datatypes.Id,
            applicant: Datatypes.Id
        }).validator(),
        run({ job, applicant }) {

            console.log( job, applicant );

            if( !this.userId || Meteor.users.findOne( this.userId ).profile.type === 'caregiver' ) {
                //current user is not a customer
                throw new Meteor.Error('jobs.hire.unauthorized',
                'You are not registered customer!');
            }

            let caregiver = Caregivers.findOne( applicant );

            if( !caregiver ) {
                //applicant id recieved is not a caregiver
                throw new Meteor.Error('jobs.hire.error',
                'This applicant does not exist!');
            }

            if( caregiver.currentJob ) {
                //applicant is already employed
                throw new Meteor.Error('jobs.hire.error',
                'Applicant is already employed!');
            }

            //update job with hired status and id
            let result = Jobs.update({
                _id: job,
                postedBy: this.userId,
                status: 'open',
                applicants: applicant
            }, { $set: {
                status: 'hired',
                hired: applicant,
                applicants: [],
                offers: []
            }});

            if( !result ) {
                //invalid input
                throw new Meteor.Error('jobs.hire.error',
                'Invalid Input, please try again!');
            }

            //update caregiver's profile with job id
            Caregivers.update( applicant, { 
                $set: { currentJob: job },
                $pull: { appliedJobs: job }
            });
        }
    });
    
    export const completeJob = new ValidatedMethod({    //mark a job complete/expired 
        name: 'jobs.complete',
        validate: detailsSchema.pick( '_id' ).validator(),
        run({ _id }) {

            if( !this.userId || Meteor.users.findOne( this.userId ).profile.type === 'caregiver' ) {
                //current user is not a customer
                throw new Meteor.Error('jobs.complete.unauthorized',
                'You are not registered customer!');
            }

            //fetch job details
            let job = Jobs.findOne({
                _id,
                postedBy: this.userId,
                status: { $in: ['open', 'hired'] }
            });

            if( !job ) {
                //invalid input
                throw new Meteor.Error('jobs.complete.error',
                'Invalid Input, please try again!');
            }

            if( job.status === 'open' ) {
                //expire job
                Jobs.update( _id, {
                    $set: { status: 'expired' }
                });

                return 'expired';
            }
            
            //complete job
            Jobs.update( _id, {
                $set: { status: 'completed' }
            });

            //update caregiver's profile with job id
            Caregivers.update( job.hired, { 
                $set: { currentJob: '' },
                $push: { jobHistory: _id }
            });

            return 'completed';

        }
    });

    export const review = new ValidatedMethod({         //review a job
        name: 'jobs.review',
        validate: reviewSchema.omit( '_id', 'date' ).validator(),
        run( review ) {

            const user = Meteor.users.findOne( this.userId );

            if( !this.userId || user.profile.type === 'caregiver' ) {
                //current user is not a customer
                throw new Meteor.Error('jobs.review.unauthorized',
                'You are not registered customer!');
            }

            //fetch job details
            let job = Jobs.findOne({
                _id: review.job,
                postedBy: this.userId,
                status: 'completed'
            });

            if( !job ) {
                //invalid input
                throw new Meteor.Error('jobs.review.error',
                'Invalid Input, please try again!');
            }

            //set review date and by
            review.date = new Date();

            //insert into database
            let reviewId = Reviews.insert( review );

            //update job
            Jobs.update( job._id, {
                $set: { review: reviewId }
            });

            return true;
        }
    });

    export const declinePayment = new ValidatedMethod({ //decline payment
        name: 'jobs.payment.decline',
        validate: new SimpleSchema({
            _id: Datatypes.Id,
            reason: {
                type: String, optional: true
            }
        }).validator(),
        run({ _id, reason }) {

            if( !this.userId || Meteor.users.findOne( this.userId ).profile.type === 'caregiver' ) {
                //current user is not a customer
                throw new Meteor.Error('jobs.payment.unauthorized',
                'You are not registered customer!');
            }

            //update job 
            let job = Jobs.update({
                _id,
                postedBy: this.userId,
                status: 'completed',
                review: { $exists: true }
            }, { $set: {
                payment: 'declined',
                reason
            }});

            if( !job ) {
                //invalid input
                throw new Meteor.Error('jobs.payment.error',
                'Invalid Input, please try again!');
            }
        }
    });

    //to be revisited
    export const pay= new ValidatedMethod({             //complete payment (simulate)
        name: 'jobs.payment.complete',
        validate: detailsSchema.pick( '_id' ).validator(),
        run({ _id }) {

            if( !this.userId || Meteor.users.findOne( this.userId ).profile.type === 'caregiver' ) {
                //current user is not a customer
                throw new Meteor.Error('jobs.payment.unauthorized',
                'You are not registered customer!');
            }

            //update job 
            let job = Jobs.update({
                _id,
                postedBy: this.userId,
                status: 'completed',
                review: { $exists: true }
            }, { 
                $set: { payment: 'completed' }
            });

            return true;
        }
    });

//helpers

    Jobs.helpers({
        username() {
            return Meteor.users.findOne( this.postedBy ).fullName;
        },
        dp() {
            return JobImages.findOne({ meta: { job: this._id }, profile: true });
        },
        photos() {
            return JobImages.find({ meta: { job: this._id }});
        },
        appliedCaregivers() {
            return Caregivers.find({
                _id: { $in: this.applicants },
                appliedJobs: this._id
            });
        },
        offeredCaregivers() {
            return Caregivers.find({
                _id: { $in: this.offers },
                offers: this._id
            });
        },
        hiredCaregiver() {
            return Caregivers.findOne({
                _id: this.hired,
                $or: [
                    { currentJob: this._id },
                    { jobHistory: this._id }
                ]
            });
        },
        getReview() {
            return Reviews.findOne({ job: this._id });
        }
    });

    Reviews.helpers({
        by() {
            return Jobs.findOne( this.job ).username();
        },
        getJob() {
            return Jobs.findOne( this.job );
        }
    });
