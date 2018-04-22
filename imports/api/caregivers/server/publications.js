import { Meteor } from 'meteor/meteor';

import { Caregivers } from '../index.js';

Meteor.publish('caregivers', function() {
    return Caregivers.find({});
});

Meteor.publish('caregiverById', function( id ) {
    return Caregivers.find( id );
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
        currentJob: 1,
        appliedJobs: 1,
        jobHistory: 1,
    }});
});
