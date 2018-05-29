import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Caregivers, CaregiverImages } from '../../../../api/caregivers';
import { Jobs, hireApplicant, offerJob } from '../../../../api/jobs';
import { bookmarkCaregiver } from '../../../../api/users';

import showAlert from '../../../shared-components/alert';
import '../../../helpers';
import '../../../shared-components/compose-modal';
import './hire-caregiver.html';
import './caregiver-profile.html';

Template.CaregiverProfile.onCreated(function() {
    let t = this;
    let id = Template.currentData().id();
    t.subscribe( 'caregiverById', id );
});

Template.CaregiverProfile.helpers({
    caregiver() {
        return Caregivers.findOne( this.id );
    },
    activeClass( index ) {
        if( index === 0 ) return 'active';
    },
    notCurrentCaregiver() {
        return Caregivers.findOne( this.id ).user !== Meteor.userId();
    },
    caregiverBackgroundCheck() {
        return !!Caregivers.findOne( this.id ).background;
    },
    isBookmarked() {
        let id = Template.currentData().id();
        let bookmarks = Meteor.user().bookmarks;
        return _.indexOf( bookmarks, id ) !== -1;
    },
    isCustomer() {
        return Meteor.user().profile.type === 'customer';
    },
    msgDoc() {
        const t = Caregivers.findOne( this.id );
        const recipient = Meteor.users.findOne( t.user ).username;
        return { recipient };
    }
});

Template.CaregiverProfile.events({ 
    'click .favorite a'( e, t ) { 
        let id = t.data.id();
        bookmarkCaregiver.call({ id });
    },
    'click .finalise'() {
        Meteor.call('caregiver.complete', ( err, res )=> {
            if( err ) {
                showAlert( err.reason, 'danger');
            } else {
                showAlert( 'Your Caregiver Profile has been submitted! You can now apply for Jobs!' );
            }
        });
    }
});

Template.hireCaregiverModal.onCreated(function() {
    this.autorun(()=> {
        this.subscribe( 'myJobs' );
    });
});

Template.hireCaregiverModal.helpers({
    jobs() {
        return Jobs.find({
            postedBy: Meteor.userId(),
            status: { $in: ['open', 'hired'] }
        });
    },
    isApplicant() {
        let caregiver = this.caregiver, job = this.job;
        let a = _.indexOf( caregiver.appliedJobs, job._id ) !== -1;
        let b = _.indexOf( job.applicants, caregiver._id ) !== -1;
        return a && b;
    },
    isOffered() {
        let caregiver = this.caregiver, job = this.job;
        let a = _.indexOf( caregiver.offers, job._id ) !== -1;
        let b = _.indexOf( job.offers, caregiver._id ) !== -1;
        return a && b;
    },
    isHired() {
        let caregiver = this.caregiver, job = this.job;
        let a = caregiver.currentJob === job._id;
        let b = job.hired === caregiver._id;
        return a && b;
    }
});
Template.hireCaregiverModal.events({ 
    'click .accept'( e, t ) { 
        hireApplicant.call({
            job: t.$(e.target).attr('id'),
            applicant: t.data._id
        }, ()=> {
            showAlert('Successfully hired this applicant!');
        });
    },

    'click .offer'( e, t ) {
        offerJob.call({
            job: t.$(e.target).attr('id'),
            caregiverId: t.data._id
        }, ( err, res )=> {
            if( err ) {
                console.error( err );
            } else {
                showAlert('Job offer sent!');
            }
        });
    }
});
