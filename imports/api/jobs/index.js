import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { analytics } from 'meteor/okgrow:analytics';

import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

import { Caregivers } from '../caregivers';
import { detailsSchema, photoSchema, reviewSchema } from './schema.js';
import { JobImages } from './images';
import { Notifications } from '../notifications';
import userChecks from '../users/checks';
import caregiverChecks from '../caregivers/checks';

import { updateJobDetails, updateJobRequirements } from './methods';

export const Jobs = new Mongo.Collection('jobs');
export const Reviews = new Mongo.Collection('reviews');
export { JobImages, updateJobDetails, updateJobRequirements };

//methods

    export const newJob = new ValidatedMethod({         //post a new job 
        name: 'jobs.new',
        validate: detailsSchema.omit('_id', 'postedBy').validator(),
        run( job ) {
            
            userChecks.loggedIn( this.userId );
            userChecks.isVerified( this.userId );
            userChecks.isCustomer( this.userId );

            job.postedBy = this.userId;     //posted by the current user
            job.postedOn = new Date();      //posted right now
            job.status = 'open';            //jobs open by default
            job.offers = [];                //initialize offers array
            job.applicants = [];            //and applicants array

            const id = Jobs.insert( job );  //post the job

            JobImages.update({              //set uploaded photos to new job
                meta: {
                    job: 'new',
                    user: this.userId
                }
            }, { $set: { meta: { job: id } } }, { multi: true });

            if( this.isSimulation ) analytics.track('New Job', {
                title: job.title,
                duration: job.duration,
                location: job.location
            });

            return true;
        }
    });

    export const setDp = new ValidatedMethod({          //update profile image 
        name: 'jobs.images.set.profile',
        validate: photoSchema.validator(),
        run({ _id, job }) {

            userChecks.loggedIn( this.userId );
            userChecks.isCustomer( this.userId );

            let meta = { job };
            if( job === 'new' ) meta.user = this.userId;

            JobImages.update({
                meta, profile: true
            }, {
                $set: { profile: false }
            });

            const photo = JobImages.update({ _id, meta }, {
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

            userChecks.loggedIn( this.userId );
            userChecks.isCustomer( this.userId );

            let meta = { job };
            if( job === 'new' ) meta.user = this.userId;

            let photo = JobImages.findOne({
                _id, meta
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

            userChecks.loggedIn( this.userId );
            userChecks.isCustomer( this.userId );

            if( job.postedBy !== this.userId )
                //recieved document doesn't belong to current user
                throw new Meteor.Error('jobs.update.unauthorized',
                'Invalid Input or this job was not poste by you. Please try again');

            let result = Jobs.update({
                _id: job._id,
                postedBy: job.postedBy
            }, { $set: job });

            if( !result ) {
                throw new Meteor.Error('jobs.update.unauthorized',
                'Invalid Input. Please try a   gain');
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

            userChecks.loggedIn( this.userId );
            userChecks.isCustomer( this.userId );

            let caregiver = Caregivers.findOne( caregiverId );

            if( !caregiver ) {
                //input id recieved is not a caregiver
                throw new Meteor.Error('jobs.offer.error',
                'Invalid Input, please try again!');
            }

            caregiverChecks.isComplete( caregiver );

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

            //notify caregiver
            if( !this.isSimulation ) Caregivers.notifications.newOffer({ caregiverId, jobId: job });
        }
    });

    export const hireApplicant = new ValidatedMethod({  //hire an applicant 
        name: 'jobs.hire',
        validate: new SimpleSchema({
            job: Datatypes.Id,
            applicant: Datatypes.Id
        }).validator(),
        run({ job, applicant }) {

            userChecks.loggedIn( this.userId );
            userChecks.isCustomer( this.userId );

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

            //fetch job details
            const jobDoc = Jobs.findOne({
                _id: job,
                postedBy: this.userId,
                status: 'open',
                applicants: applicant
            });

            if( !jobDoc._id ) {
                //invalid input
                throw new Meteor.Error('jobs.hire.error',
                'Invalid Input, please try again!');
            }

            //update job with hired status and id
            Jobs.update( jobDoc._id, { $set: {
                status: 'hired',
                hired: applicant,
                applicants: [],
                offers: []
            }});

            //update caregiver's profile with job id
            Caregivers.update( applicant, { 
                $set: { currentJob: job },
                $pull: { appliedJobs: job }
            });

            //notifications
            if( !this.isSimulation ) {
                //notify hired applicant
                Caregivers.notifications.appAccepted({ jobId: job, caregiverId: applicant });

                //notify other applicants
                jobDoc.applicants.filter( app=> app !== applicant ).forEach( caregiverId=> {
                    Caregivers.notifications.appNotAccepted({ caregiverId, jobId: job });
                });

                //notify offered caregivers
                jobDoc.offers.forEach( caregiverId=> {
                    Caregivers.notifications.offerExpired({ caregiverId, jobId: job });
                });
            }
        }
    });
    
    export const completeJob = new ValidatedMethod({    //mark a job complete/expired 
        name: 'jobs.complete',
        validate: detailsSchema.pick( '_id' ).validator(),
        run({ _id }) {

            userChecks.loggedIn( this.userId );
            userChecks.isCustomer( this.userId );

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

                //notifications
                if( !this.isSimulation ) {

                    //notify applicants
                    job.applicants.forEach( caregiverId=> {
                        Caregivers.notifications.appNotAccepted({ caregiverId, jobId: job });
                    });

                    //notify offered caregivers
                    job.offers.forEach( caregiverId=> {
                        Caregivers.notifications.offerExpired({ caregiverId, jobId: job });
                    });

                }

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

            //notify caregiver
            if( !this.isSimulation ) {
                Caregivers.notifications.jobCompleted({ jobId: _id });
            }

            return 'completed';

        }
    });

    export const review = new ValidatedMethod({         //review a job
        name: 'jobs.review',
        validate: reviewSchema.omit( '_id', 'date' ).validator(),
        run( review ) {

            userChecks.loggedIn( this.userId );
            userChecks.isCustomer( this.userId );

            //fetch job details
            let job = Jobs.findOne({
                _id: review.job,
                postedBy: this.userId,
                status: 'completed'
            });

            if( !job || job.review ) {
                //invalid input
                throw new Meteor.Error('jobs.review.error',
                'This job is either cannot be reviewed or does not exist!');
            }

            //set review date and by
            review.date = new Date();

            //insert into database
            let reviewId = Reviews.insert( review );

            //update job
            Jobs.update( job._id, {
                $set: { review: reviewId }
            });

            //notify caregiver
            if( !this.isSimulation ) Caregivers.notifications.reviewed({ jobId: job._id });

            return true;
        }
    });

    export const viewJob = new ValidatedMethod({
        name: 'jobs.view',
        validate: detailsSchema.pick( '_id' ).validator(),
        run({ _id }) {

            userChecks.loggedIn( this.userId );            

            const job = Jobs.findOne( _id );

            if( job.postedBy !== this.userId ) {
                //current user is not the owner of the job
                const caregiver = Caregivers.findOne({ user: this.userId });

                const isHired = job.hired === caregiver._id;
                const isApplicant = _.indexOf( job.applicants, caregiver._id ) !== -1;
                const isOffered = _.indexOf( job.offers, caregiver._id ) !== -1;
    
                if( !( isHired || isApplicant || isOffered ) ) {
                    //current user is not the hired caregiver for this job
                    throw new Meteor.Error('jobs.unauthorized', 
                    'You are not associated with this job!');
                }
            }

            Notifications.remove({
                job: _id,
                type: 'job',
                user: this.userId
            });
        }
    });

    export const repostJob = new ValidatedMethod({         //repost a old job 
        name: 'jobs.repost',
        validate: detailsSchema.pick('_id', 'postedBy').validator(),
        run: function({ _id, postedBy }) {

            userChecks.loggedIn(this.userId);
            userChecks.isVerified(this.userId);
            userChecks.isCustomer(this.userId);

            let job = Jobs.findOne({
                _id, postedBy
            });

            if ( !job ) 
                throw new Meteor.Error('jobs.repost.error',
                'This job is not posted by you');

            job.postedBy = this.userId;     //posted by the current user
            job.postedOn = new Date();      //posted right now
            job.status = 'open';            //jobs open by default
            job.offers = [];                //initialize offers array
            job.applicants = [];            //and applicants array
            delete job._id;
            delete job.hired;
            delete job.review;

            const id = Jobs.insert(job);  //post the job

            let jobImages = JobImages.find({  //find old job's photos
                meta: { job: _id }
            }).fetch();

            jobImages = jobImages.forEach(( obj )=> {   //for each uploaded photo
                obj.meta.job = id;              //set meta to new job id
                delete obj._id;                 //delete old database id
                JobImages.insert( obj );        //insert new object into collection
            });

            if ( this.isSimulation ) analytics.track('Reposted Job', {
                title: job.title,
                duration: job.duration,
                location: job.location
            });

            return true;
        }
    });

//helpers

    Jobs.helpers({
        username() {
            return Meteor.users.findOne( this.postedBy ).fullName;
        },
        user() {
            return Meteor.users.findOne( this.postedBy );
        },
        dp() {
            const img = JobImages.findOne({ meta: { job: this._id }, profile: true });
            return img ? img : {
                link: `/img/job-placeholder-${this.gender}jpeg`
            };
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
        getJob() {
            return Jobs.findOne( this.job );
        }
    });
