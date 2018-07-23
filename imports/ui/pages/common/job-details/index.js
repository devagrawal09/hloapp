import { Template } from 'meteor/templating';

import { Jobs } from '../../../../api/jobs';
import { applyForJob } from '../../../../api/caregivers';

import showAlert from '../../../shared-components/alert';
import '../../../shared-components/admin-buttons';
import '../../../shared-components/compose-modal';
import './job-details.html';

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('jobs');
    Package['msavin:mongol'].Mongol.showCollection('job-images');
}

Template.JobDetails.onCreated(function() {
    let id = this.data.id();
    this.autorun(()=> {
        this.subscribe( 'jobById', id, ()=> {
            document.title = Jobs.findOne( id ).title;
        });
        this.subscribe( 'jobs.images', id );
        this.subscribe( 'caregiver.employment' );
        console.log( 'subscribe here', id );
    });
});

Template.JobDetails.helpers({
    isAdmin() {
        return Meteor.user().username === 'admin';
    },
    job() {
        return Jobs.findOne( this.id() );
    },
    activeClass( index ) {
        if( index === 0 ) return 'active';
    },
    isPostedByCurrent() {
        let job = Jobs.findOne( this.id() );
        return job.postedBy === Meteor.userId();
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
    },
    isOngoing() {
        let caregiver = Meteor.user().getCaregiver();
        let job = Jobs.findOne( this.id() );
        let a = caregiver.currentJob === job._id;
        let b = job.hired === caregiver._id;
        return a && b;
    },
    isOpen() {
        let job = Jobs.findOne( this.id() );
        return job.status === 'open';
    },
    msgDoc() {
        const job = Jobs.findOne( this.id() );
        const recipient = Meteor.users.findOne( job.postedBy ).username;
        const subject = job.title;
        return { recipient, subject };
    }
});

Template.JobDetails.events({ 
    'click .apply'( e, t ) {
        applyForJob.call({
            _id: t.data.id()
        }, ( err, res )=> {
            if( err ){
                console.error( err );
            } else {
                showAlert('Successfully applied for this job!');
            }
        });
    },
    'click .accept'() {},
    'click .msg'() {}
});
