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

Meteor.publish('caregiver.profile', function(){
    return Caregivers.find({
        user: this.userId
    }, { fields: {
        user: 1,
        firstName: 1,
        lastName: 1,
        gender: 1,
        dob: 1,
        aboutText: 1,
        address: 1,
        district: 1,
        country: 1,
        religion: 1,
        hobbies: 1,
        workLocation: 1,
        languages: 1
    }});
});

Meteor.publish('caregiver.experiences', function(){
    return Caregivers.find({
        user: this.userId
    }, { fields: {
        user: 1,
        years: 1,
        experiences: 1,
        background: 1,
        education: 1
    }});
});

Meteor.publish('caregiver.services', function(){
    return Caregivers.find({
        user: this.userId
    }, { fields: {
        user: 1,
        hourlyRate: 1,
        extraCharges: 1,
        ownsCar: 1,
        availableDays: 1,
        availableTimeStart: 1,
        availableTimeEnd: 1,
        caregiverType: 1,
        professionalServices: 1,
        personalServices: 1,
        medicalExpertise: 1
    }});
});

Meteor.publish('caregiver.plan', function(){
    return Caregivers.find({
        user: this.userId
    }, { fields: {
        user: 1,
        plan: 1,
    }});
});

Meteor.publish('caregiver.profileImage', function(){
    return Caregivers.find({
        user: this.userId
    }, { fields: { profileImg: 1 }});
});

Meteor.publish('caregiver.coverImage', function(){
    return Caregivers.find({
        user: this.userId
    }, { fields: { coverImg: 1 }});
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
