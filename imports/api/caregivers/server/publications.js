import { Meteor } from 'meteor/meteor';

import { Caregivers, CaregiverImages } from '../index.js';
import { Jobs, Reviews } from '../../jobs';

Meteor.publish('caregivers', function() {
    return Caregivers.find({
        isProfileComplete: true
    });
});

Meteor.publishComposite('caregiverById', function( id ) {
    return {
        find() {
            return Caregivers.find( id );
        },
        children: [{
            find( caregiver ) {
                return Meteor.users.find( caregiver.user, {
                    fields: { username: 1 }
                });
            }
        }, {
            find( caregiver ) {
                return CaregiverImages.find({
                    meta: { user: caregiver.user }
                }).cursor
            }
        }]
    }
});

Meteor.publish('caregiversById', function( ids ) {
    return Caregivers.find({
        _id: { $in: ids }
    });
});

Meteor.publish('caregiverByUser', function( user ) {
    return Caregivers.find({ user });
});

Meteor.publish('caregiver.current', function() {
    return [
        Caregivers.find({ user: this.userId }),
        CaregiverImages.find({
            meta: { user: this.userId }
        }).cursor
    ];
});

Meteor.publish('caregiver.images', function( user ) {
    return CaregiverImages.find({
        meta: { user }
    }).cursor;
});

Meteor.publish('caregiverById.images', function( _id ) {
    let caregiver = Caregivers.findOne( _id );
    return CaregiverImages.find({
        meta: { user: caregiver.user }
    }).cursor;
});

Meteor.publish('caregiver.image', function( _id ) {
    return CaregiverImages.find({ _id }).cursor;
});

Meteor.publishComposite('caregiver.employment', {
    find() {
        return Caregivers.find({
            user: this.userId
        }, { fields: {
            user: 1,
            offers: 1,
            currentJob: 1,
            appliedJobs: 1,
            jobHistory: 1,
        }});
    },
    children: [{
        find( caregiver ) {
            return Jobs.find({ $or: [
                { _id: caregiver.currentJob, hired: caregiver._id },
                { _id: { $in: caregiver.offers }, offers: caregiver._id },
                { _id: { $in: caregiver.appliedJobs }, applicants: caregiver._id },
                { _id: { $in: caregiver.jobHistory }, hired: caregiver._id }
            ]});
        },
        children: [{
            find( job ) {
                return Reviews.find({ job: job._id });
            }
        }, {
            find( job ) {
                return Meteor.users.find( job.postedBy, {
                    fields: { fullName: 1, username: 1 }
                });
            }
        }]
    }]
});
