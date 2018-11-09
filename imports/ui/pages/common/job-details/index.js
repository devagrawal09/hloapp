import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Jobs } from '../../../../api/jobs';
import { applyForJob, acceptOffer } from '../../../../api/caregivers';

import TCdata from '../../../../api/data-types/tc.js';

import showAlert from '../../../shared-components/alert';
import '../../../shared-components/admin-buttons';
import '../../../shared-components/compose-modal';
import './job-details.html';

if( Meteor.settings.public.env === 'development' ) {
    Package['msavin:mongol'].Mongol.showCollection('jobs');
    Package['msavin:mongol'].Mongol.showCollection('job-images');
}

const texts = new ReactiveVar({});

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
    this.autorun( ()=> {
        let lang = Session.get('lang');
        if( lang === 'tc' )
            import(`./tc.js`).then( i => {
                texts.set( i.texts );
            });
        else
            import(`./en.js`).then( i => {
                texts.set( i.texts );
            });
    });
});

Template.JobDetails.helpers({
    texts() {
        return texts.get();
    },
    isAdmin() {
        return Meteor.user().username === 'admin';
    },
    job() {
        let job = Jobs.findOne( this.id() );
        if( Session.equals('lang', 'tc') ) {
            if(job.location) job.location = TCdata.locations[ job.location ];
            if(job.languages) job.languages = job.languages.map( lang=> TCdata.languages[ lang ] );
            if(job.caregiverType) job.caregiverType = job.caregiverType.map( type=> TCdata.careTypes[ type ] );
            if(job.professionalServices) job.professionalServices = job.professionalServices.map( service=> TCdata.professional[ service ] );
            if(job.personalServices) job.personalServices = job.personalServices.map( service=> TCdata.personal[ service ] );
            if(job.medicalConditions) job.medicalConditions = job.medicalConditions.map( mc=> TCdata.medical[ mc ] );
        };
        return job;
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
                showAlert( err.reason, 'danger');
            } else {
                showAlert('Successfully applied for this job!');
            }
        });
    },
    'click .accept'( e, t ) {
        acceptOffer.call({
            _id: t.data.id()
        }, ( err, res )=> {
            if( err ){
                console.error( err );
                showAlert( err.reason, 'danger');
            } else {
                showAlert('Successfully accepted the offer for this job!');
            }
        });
    }
});
