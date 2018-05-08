import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import SimpleSchema from 'simpl-schema';
import Datatypes from '../data-types';

import { Caregivers } from '../caregivers';
import { detailsSchema } from './schema.js';

export const Jobs = new Mongo.Collection('jobs');

//methods

    export const newJob = new ValidatedMethod({         //post a new job (customer)
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
            job.applicants = [];            //no applicants by default

            Jobs.insert( job );             //post the job

            return true;
        }
    });

    export const updateJob = new ValidatedMethod({      //update job details (customer)
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

    export const applyForJob = new ValidatedMethod({    //apply for job (caregiver)
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
                $push: { applicants: this.userId } 
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
        }
    });

    export const hireApplicant = new ValidatedMethod({  //hire an applicant (customer)
        name: 'jobs.hire',
        validate: new SimpleSchema({
            job: Datatypes.Id,
            applicant: Datatypes.Id
        }).validator(),
        run({ _id, applicant }) {

            if( !this.userId || Meteor.users.findOne( this.userId ).profile.type === 'caregiver' ) {
                //current user is not a customer
                throw new Meteor.Error('jobs.hire.unauthorized',
                'You are not registered customer!');
            }

            let caregiver = Caregivers.findOne( applicant );

            if( !caregiver ) {
                //applicant id recieved is not a caregiver
                throw new Meteor.Error('jobs.hire.error',
                'Invalid Input, please try again!');
            }

            if( caregiver.currentJob ) {
                //applicant is already employed
                throw new Meteor.Error('jobs.hire.error',
                'Applicant is already employed!');
            }

            //update job with hired status and id
            let result = Jobs.update({
                _id,
                postedBy: this.userId,
                status: 'open',
                applicants: applicant
            }, { $set: {
                status: 'hired',
                hired: applicant
            }});

            if( !result ) {
                //invalid input
                throw new Meteor.Error('jobs.hire.error',
                'Invalid Input, please try again!');
            }

            //update caregiver's profile with job id
            Caregivers.update( applicant, { $set: {
                currentJob: _id
            }});
        }
    });

    //incomplete
    export const completeJob = new ValidatedMethod({    //mark a job complete (customer)
        name: 'jobs.complete',
        validate: detailsSchema.pick( '_id' ).validator(),
        run({ _id }) {

            if( !this.userId || Meteor.users.findOne( this.userId ).profile.type === 'caregiver' ) {
                //current user is not a customer
                throw new Meteor.Error('jobs.complete.unauthorized',
                'You are not registered customer!');
            }

            let result = Jobs.update({
                _id,
                postedBy: this.userId,
                status: { $in: ['open', 'hired'] }
            }, { $set: {
                status: 'completed'
            }});

            if( !result ) {
                //invalid input
                throw new Meteor.Error('jobs.complete.error',
                'Invalid Input, please try again!');
            }
        }
    });

//helpers

    Jobs.helpers({
        username() {
            return Meteor.users.findOne( this.postedBy ).fullName;
        }
    });
