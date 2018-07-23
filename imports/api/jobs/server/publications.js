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

Meteor.publishComposite('ownJobById', function( _id ) {
    return {
        find() {
            return Jobs.find({
                _id, postedBy: this.userId
            });
        },
        children: [{
            find( job ) {
                return JobImages.find({
                    meta: { job: job._id }
                }).cursor;
            }
        }]
    }
});

Meteor.publishComposite('jobs', {
    find() {
        return Jobs.find({ status: 'open' });
    },
    children: [{
        find( job ) {
            return JobImages.find({
                meta: { job: job._id }, profile: true
            }).cursor;
        }
    }]
});

Meteor.publishComposite('jobs.ads', function({ filter = {}, sort, limit }) {

    check( filter, Object );
    check( sort, Object );
    check( limit, Match.Integer );

    filter.status = 'open';

    return {
        find() {
            return Jobs.find( filter, { fields: {

            }, sort, limit });
        },
        children: [{
            find( job ) {
                return JobImages.find({
                    meta: { job: job._id }, profile: true
                }).cursor;
            }
        }]
    }
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

Meteor.publish('job.new.photos', function() {
    return JobImages.find({
        meta: { job: 'new', user: this.userId }
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

Meteor.publishComposite('featured', {
    find() {
        return Jobs.find({
            status: 'open',
            featured: true
        });
    },
    children: [{
        find( job ) {
            return JobImages.find({
                meta: { job: job._id }, profile: true
            }).cursor;
        }
    }]
});

// JobImages.remove({});
