import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { jobDetails, jobRequirements } from './schema.js';
import userChecks from '../users/checks';

export const updateJobDetails = new ValidatedMethod({      //update job details 
    name: 'jobs.update.details',
    validate: jobDetails.validator(),
    run( job ) {

        userChecks.loggedIn( this.userId );
        userChecks.isCustomer( this.userId );

        if( job.postedBy !== this.userId )
            //recieved document doesn't belong to current user
            throw new Meteor.Error('jobs.update.unauthorized',
            'Invalid Input or this job was not posted by you. Please try again');

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

export const updateJobRequirements = new ValidatedMethod({      //update job reqs 
    name: 'jobs.update.requirememnts',
    validate: jobRequirements.validator(),
    run( job ) {

        userChecks.loggedIn( this.userId );
        userChecks.isCustomer( this.userId );

        if( job.postedBy !== this.userId )
            //recieved document doesn't belong to current user
            throw new Meteor.Error('jobs.update.unauthorized',
            'Invalid Input or this job was not posted by you. Please try again');

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