import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Caregivers, CaregiverImages } from '../../../../api/caregivers';
import { Jobs, hireApplicant, offerJob } from '../../../../api/jobs';
import { bookmarkCaregiver } from '../../../../api/users';

import showAlert from '../../../shared-components/alert';
import '../../../helpers';

import './hire-caregiver.html';
import './caregiver-profile.html';

Template.CaregiverProfile.onCreated(function() {
    let t = this;
    let id = Template.currentData().id();
    t.autorun(()=> {
        t.subscribe( 'caregiverById', id, ()=> {
            t.doc = Caregivers.findOne( id );
            t.subscribe( 'caregiver.images', t.doc.user );
        });
    });
});

Template.CaregiverProfile.helpers({
    caregiver() {
        return Template.instance().doc;
    },
    activeClass( index ) {
        if( index === 0 ) return 'active';
    },
    notCurrentCaregiver() {
        return Template.instance().doc.user !== Meteor.userId();
    },
    caregiverBackgroundCheck() {
        return !!Template.instance().doc.background;
    },
    isBookmarked() {
        let id = Template.currentData().id();
        let bookmarks = Meteor.user().bookmarks;
        return _.indexOf( bookmarks, id ) !== -1;
    },
    isCustomer() {
        return Meteor.user().profile.type === 'customer';
    }
});

Template.CaregiverProfile.events({ 
    'click .favorite a'( e, t ) { 
        let id = t.data.id();
        bookmarkCaregiver.call({ id });
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
    isApplicant( job ) {
        let caregiver = this;
        let a = _.indexOf( caregiver.appliedJobs, job._id ) !== -1;
        let b = _.indexOf( job.applicants, caregiver._id ) !== -1;
        return a && b;
    },
    isOffered( job ) {
        let caregiver = this;
        let a = _.indexOf( caregiver.offers, job._id ) !== -1;
        let b = _.indexOf( job.offers, caregiver._id ) !== -1;
        return a && b;
    },
    isHired( job ) {
        let caregiver = this;
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
