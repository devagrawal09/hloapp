import { Meteor } from 'meteor/meteor';

import { Caregivers, CaregiverImages } from '../index.js';
import { Jobs } from '../../jobs';

Meteor.publish('caregivers', function() {
    return Caregivers.find({
        isProfileComplete: true
    });
});

Meteor.publish('caregiverById', function( id ) {
    return Caregivers.find( id );
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
    return Caregivers.find({ user: this.userId });
});

Meteor.publish('caregiver.employment', function(){
    return Caregivers.find({
        user: this.userId
    }, { fields: {
        user: 1,
        offers: 1,
        currentJob: 1,
        appliedJobs: 1,
        jobHistory: 1,
    }});
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

Meteor.publish('caregiver.currentJob', function() {
    let caregiver = Caregivers.findOne({ user: this.userId });
    return Jobs.find({
        _id: caregiver.currentJob,
        hired: caregiver._id
    });
});

Meteor.publish('caregiver.appliedJobs', function() {
    let caregiver = Caregivers.findOne({ user: this.userId });
    return Jobs.find({
        _id: { $in: caregiver.appliedJobs },
        applicants: caregiver._id
    });
});

Meteor.publish('caregiver.jobHistory', function() {
    let caregiver = Caregivers.findOne({ user: this.userId });
    return Jobs.find({
        _id: { $in: caregiver.jobHistory },
        hired: caregiver._id
    });
});
