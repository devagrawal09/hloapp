import { Meteor } from 'meteor/meteor';

import { Jobs, JobImages } from '..';

Meteor.publish('jobById', function( id ) {
    return Jobs.find( id );
});

Meteor.publish('jobs', function() {
    return Jobs.find({});
});

Meteor.publish('myJobs', function() {
    return Jobs.find({
        postedBy: this.userId
    });
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
