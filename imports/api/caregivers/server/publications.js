import { Meteor } from 'meteor/meteor';

import { Caregivers, CaregiverImages } from '../index.js';

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
