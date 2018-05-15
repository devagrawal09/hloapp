import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Jobs } from '../../../../api/jobs';
import { applyForJob } from '../../../../api/caregivers';

import './job-details.html';

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('jobs');
    Package['msavin:mongol'].Mongol.showCollection('job-images');
}

Template.JobDetails.onCreated(function() {
    let id = this.data.id();
    this.autorun(()=> {
        this.subscribe( 'jobById', id );
        this.subscribe( 'jobs.images', id );
        this.subscribe( 'caregiver.employment' );
        console.log( 'subscribe here', id );
    });
});

Template.JobDetails.helpers({
    job() {
        return Jobs.findOne( this.id() );
    },
    activeClass( index ) {
        if( index === 0 ) return 'active';
    },
    isCaregiver() {
        return Meteor.user().profile.type === 'caregiver';
    },
    isOffered() {
        let caregiver = Meteor.user().getCaregiver();
        let job = Jobs.findOne( this.id() );
        let a = _.indexOf( caregiver.offers, job._id ) !== -1;
        let b = _.indexOf( job.offers, caregiver._id ) !== -1;
        return a && b;
    },
    isApplied() {
        let caregiver = Meteor.user().getCaregiver();
        let job = Jobs.findOne( this.id() );
        let a = _.indexOf( caregiver.appliedJobs, job._id ) !== -1;
        let b = _.indexOf( job.applicants, caregiver._id ) !== -1;
        return a && b;
    }
});

Template.JobDetails.events({ 
    'click .apply'( e, t ) {
        applyForJob.call({
            _id: t.data.id()
        });
    },
    'click .accept'() {},
    'click .msg'() {}
});
