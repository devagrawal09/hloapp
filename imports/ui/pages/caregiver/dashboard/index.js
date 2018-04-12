import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Caregivers } from '../../../../api/caregivers';
Package['msavin:mongol'].Mongol.showCollection('caregivers');

import './job-history.html';

Template.JobHistory.onCreated(function() {
    let t = this;
    t.autorun(()=> {
        t.subscribe('caregiver.employment');
    });
});

Template.JobHistory.helpers({
    employment() {
        return Caregivers.findOne({
            user: Meteor.userId()
        }, { fields: {
            currentJob: 1,
            appliedJobs: 1,
            jobHistory: 1,
        }});
    }
});
