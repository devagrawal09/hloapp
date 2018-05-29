import { Meteor } from 'meteor/meteor';

import { Jobs, JobImages, Reviews } from '..';

Meteor.publishComposite('jobById', function( id ) {
    return {
        find() {
            return Jobs.find( id );
        },
        children: [{
            find( job ) {
                return Meteor.users.find( job.postedBy, {
                    fields: { fullName: 1, username: 1 }
                });
            }
        }]
    }
});

Meteor.publish('jobs', function() {
    return Jobs.find({});
});

Meteor.publishComposite('myJobs', {
    find() {
        return Jobs.find({
            postedBy: this.userId
        });
    },
    children: [{
        find( job ) {
            return Reviews.find({ job: job._id });
        }
    }]
});

Meteor.publish('jobs.images', function( job ) {
    return JobImages.find({
        meta: { job }
    }).cursor;
});

Meteor.publish('jobs.applicants', function( job ) {
    return Jobs.findOne( job ).appliedCaregivers();
});

Meteor.publish('jobs.offers', function( job ) {
    return Jobs.findOne( job ).offeredCaregivers();
});

Meteor.publish('jobs.hired', function( job ) {
    return Jobs.findOne( job ).hiredCaregiver();
});

Meteor.publish('jobs.hired.dp', function( job ) {
    return Jobs.findOne( job ).hiredCaregiver().fetch()[0].dp().cursor;
});
