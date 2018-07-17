import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import '../../../api/admin';

import showAlert from '../alert';

import './admin-buttons.html';

Template.adminButtons.events({
    'click .toggle-status'( e, t ) {
        const caregiver = t.data.caregiver;
        Meteor.call('setCaregiverStatus', {
            caregiverId: caregiver._id,
            status: !caregiver.isProfileComplete
        }, ( err )=> {
            if( err ) showAlert( err.reason, 'danger');
        });
    },
    'click .toggle-prof'( e, t ) {
        const caregiver = t.data.caregiver;
        Meteor.call('setProfessional', {
            caregiverId: caregiver._id,
            professional: !caregiver.professional
        }, ( err )=> {
            if( err ) showAlert( err.reason, 'danger');
        });
    },
    'click .delete-c'( e, t ) {
        const caregiver = t.data.caregiver;
        Meteor.call('deleteCaregiver', {
            caregiverId: caregiver._id
        }, ( err )=> {
            if( err ) showAlert( err.reason, 'danger');
            else FlowRouter.go('/caregivers');
        });
    },
    'click .toggle-feat'( e, t ) {
        const job = t.data.job;
        Meteor.call('setFeatured', {
            jobId: job._id,
            featured: !job.featured
        }, ( err )=> {
            if( err ) showAlert( err.reason, 'danger');
        });
    },
    'click .delete-j'( e, t ) {
        const job = t.data.job;
        Meteor.call('deleteJob', {
            jobId: job._id
        }, ( err )=> {
            if( err ) showAlert( err.reason, 'danger');
            else FlowRouter.go('/jobs');
        });
    }
});